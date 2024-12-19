import { Request, Response } from "express";
import prisma from "../prisma";

// Dodanie nowego zgłoszenia własności
export const createOwnershipClaim = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { item_id, description } = req.body; // Dane z frontendu
    const user_id = (req as any).user.id; // ID użytkownika z tokenu JWT

    // Walidacja danych wejściowych
    if (!item_id || !description) {
      return res
        .status(400)
        .json({ error: "item_id and description are required." });
    }

    // Sprawdzenie, czy użytkownik już złożył zgłoszenie do tego przedmiotu
    const existingClaim = await prisma.ownership_claims.findFirst({
      where: {
        item_id,
        user_id,
      },
    });

    //    if (existingClaim) {
    //    return res
    //    .status(400)
    //  .json({ error: "You have already submitted a claim for this item." });
    //}

    // Tworzenie zgłoszenia
    const newClaim = await prisma.ownership_claims.create({
      data: {
        description,
        status: "pending",
        date_submitted: new Date(),
        item: {
          connect: { id: item_id },
        },
        user: {
          connect: { id: user_id },
        },
      },
    });

    return res.status(201).json(newClaim);
  } catch (error) {
    console.error("Error creating ownership claim:", error);
    return res.status(500).json({ error: "Unable to create ownership claim." });
  }
};

// Pobranie wszystkich zgłoszeń własności (dla pracowników/adminów)
export const getOwnershipClaims = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const claims = await prisma.ownership_claims.findMany({
      include: {
        user: true, // Dane właściciela zgłoszenia
        item: true, // Dane powiązanego przedmiotu
        verifiedBy: true, // Dane pracownika zatwierdzającego zgłoszenie (opcjonalnie)
      },
    });

    res.json(claims);
  } catch (error) {
    console.error("Error fetching ownership claims:", error);
    res.status(500).json({ error: "Error fetching ownership claims" });
  }
};

// Aktualizacja statusu zgłoszenia własności
export const updateOwnershipClaim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, verified_by } = req.body;

    const updatedClaim = await prisma.ownership_claims.update({
      where: { id: Number(id) },
      data: { status, verified_by },
    });

    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: "Error updating ownership claim" });
  }
};
