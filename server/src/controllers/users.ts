import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the .env file.");
}

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Received data:", { name, email, password });

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dodanie użytkownika do bazy danych
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user", // Domyślna rola to 'user'
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Znajdź użytkownika po e-mailu
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Sprawdź hasło
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generowanie tokenu JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" } // Token ważny przez 1 godzinę
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during login" });
  }
};

// Pobranie wszystkich użytkowników
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Pobieramy wszystkich userów
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // Załóżmy, że w bazie masz pole is_blocked boolean (jeśli chcesz taką blokadę)
        // Chyba że w ogóle usuwasz usera lub zmieniasz role
        // isBlocked: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Cannot fetch users." });
  }
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // "user", "employee", "admin"

    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Cannot update user role." });
  }
};

// PUT /api/admin/users/:id/block
export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body; // boolean

    // Jeśli w bazie masz pole np. `is_blocked`, to:
    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: {
        /* is_blocked: isBlocked */
      },
      select: { id: true, name: true, email: true },
    });

    // Ewentualnie można roszady z rolą? (np. rola = "blocked")
    // Lub w ogóle usunąć usera. To zależy od Twojej logiki.

    res.json(updatedUser);
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ error: "Cannot block/unblock user." });
  }
};

// POST /api/admin/users/:id/reset-password
export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Generujemy np. nowe hasło lub token resetu. Na potrzeby przykładu: "newPassword123"
    const newPasswordPlain = "newPassword123";
    // Zahashuj
    // import bcrypt from "bcrypt";
    // const hashed = await bcrypt.hash(newPasswordPlain, 10);

    // Zaktualizuj w bazie
    await prisma.users.update({
      where: { id: Number(id) },
      data: {
        // password: hashed
      },
    });

    // W realnym systemie: wysłanie maila, zapis do logów itp.
    res.json({ message: "Password reset successfully (example)." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Cannot reset password." });
  }
};

// POST /api/admin/employees
export const addEmployee = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Znajdź usera po email
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Ustaw user.role = "employee"
    const updated = await prisma.users.update({
      where: { id: user.id },
      data: { role: "employee" },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Cannot add employee." });
  }
};
