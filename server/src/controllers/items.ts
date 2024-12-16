import { Request, Response } from 'express';
import prisma from '../prisma';

// Pobierz wszystkie przedmioty
export const getItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await prisma.items.findMany();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch items.' });
    }
};

// Dodaj nowy przedmiot
export const addItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, category, location_found, date_found, status } = req.body;
        const newItem = await prisma.items.create({
            data: { name, description, category, location_found, date_found, status },
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Unable to add item.' });
    }
};
