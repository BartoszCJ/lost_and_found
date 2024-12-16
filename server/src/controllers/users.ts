import { Request, Response } from 'express';
import prisma from '../prisma';

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
