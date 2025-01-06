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

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user", 
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

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

   
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during login" });
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  try {

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Cannot fetch users." });
  }
};


export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body; 

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


export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body; 

   
    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: {
      
      },
      select: { id: true, name: true, email: true },
    });

   

    res.json(updatedUser);
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ error: "Cannot block/unblock user." });
  }
};


export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    
    const newPasswordPlain = "newPassword123";
    
    await prisma.users.update({
      where: { id: Number(id) },
      data: {
      
      },
    });

   
    res.json({ message: "Password reset successfully (example)." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Cannot reset password." });
  }
};


export const addEmployee = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }


    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

  
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
