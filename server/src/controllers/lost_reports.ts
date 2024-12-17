import { Request, Response } from 'express';
import prisma from '../prisma';

// Dodanie nowego zgłoszenia o zgubieniu
export const createLostReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, item_id, status } = req.body;

        const newReport = await prisma.lost_reports.create({
            data: {
                user_id,
                item_id,
                status: status || 'pending', // Domyślnie 'pending'
            },
        });

        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'Error creating lost report' });
    }
};

// Pobranie wszystkich zgłoszeń o zagubieniu
export const getLostReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await prisma.lost_reports.findMany({
            include: { user: true, item: true }, // Opcjonalnie: dołącz informacje o użytkowniku i przedmiocie
        });

        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching lost reports' });
    }
};

// Aktualizacja statusu zgłoszenia
export const updateLostReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedReport = await prisma.lost_reports.update({
            where: { id: Number(id) },
            data: { status },
        });

        res.json(updatedReport);
    } catch (error) {
        res.status(500).json({ error: 'Error updating lost report' });
    }
};
