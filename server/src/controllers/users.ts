import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the .env file.");
}


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        // Sprawdzenie, czy użytkownik już istnieje
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
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
                role: role || 'user', // Domyślna rola to 'user'
            },
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Znajdź użytkownika po e-mailu
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Sprawdź hasło
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generowanie tokenu JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Token ważny przez 1 godzinę
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login' });
    }
};




// Pobranie wszystkich użytkowników
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch users.' });
    }
};

// Dodanie nowego użytkownika
export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;
        const newUser = await prisma.users.create({
            data: { name, email, password, role },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Unable to add user.' });
    }
};
