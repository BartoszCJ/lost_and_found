import { Request, Response } from 'express';
import prisma from '../prisma';

// Dodanie nowego zgłoszenia własności
export const createOwnershipClaim = async (req: Request, res: Response): Promise<void> => {
    try {
        const { item_id, user_id, description } = req.body;

        const newClaim = await prisma.ownership_claims.create({
            data: {
                item_id,
                user_id,
                description,
                status: 'pending', // Domyślny status
            },
        });

        res.status(201).json(newClaim);
    } catch (error) {
        res.status(500).json({ error: 'Error creating ownership claim' });
    }
};

// Pobranie wszystkich zgłoszeń własności (dla pracowników/adminów)
export const getOwnershipClaims = async (req: Request, res: Response): Promise<void> => {
  try {
      const claims = await prisma.ownership_claims.findMany({
          include: {
              user: true,        // Dane właściciela zgłoszenia
              item: true,        // Dane powiązanego przedmiotu
              verifiedBy: true,  // Dane pracownika zatwierdzającego zgłoszenie (opcjonalnie)
          },
      });

      res.json(claims);
  } catch (error) {
      console.error('Error fetching ownership claims:', error);
      res.status(500).json({ error: 'Error fetching ownership claims' });
  }
};


// Aktualizacja statusu zgłoszenia własności
export const updateOwnershipClaim = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, verified_by } = req.body;

        const updatedClaim = await prisma.ownership_claims.update({
            where: { id: Number(id) },
            data: { status, verified_by },
        });

        res.json(updatedClaim);
    } catch (error) {
        res.status(500).json({ error: 'Error updating ownership claim' });
    }
};
