import { Request, Response } from "express";
import prisma from "../prisma";

// Dodanie nowego zgłoszenia o zgubieniu
export const createLostReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; // ID użytkownika z JWT
    const { name, description, location_found, date_found } = req.body;

    if (!name || !description || !location_found || !date_found) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const newLostReport = await prisma.lost_reports.create({
      data: {
        user_id: userId,
        name,
        description,
        location_found,
        date_found: new Date(date_found),
        status: "pending",
        date_reported: new Date(),
      },
    });

    res.status(201).json(newLostReport);
  } catch (error) {
    console.error("Error creating lost report:", error);
    res.status(500).json({ error: "Unable to create lost report." });
  }
};

export const getUserLostReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; // ID użytkownika z JWT

    const reports = await prisma.lost_reports.findMany({
      where: { user_id: userId },
      include: {
        item: true, // Opcjonalnie pobieramy szczegóły powiązanego przedmiotu
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching user's lost reports:", error);
    res.status(500).json({ error: "Unable to fetch lost reports." });
  }
};


// Pobranie wszystkich zgłoszeń o zagubieniu
export const getLostReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reports = await prisma.lost_reports.findMany({
      include: { user: true, item: true }, // Opcjonalnie: dołącz informacje o użytkowniku i przedmiocie
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching lost reports" });
  }
};

// Aktualizacja statusu zgłoszenia
export const updateLostReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReport = await prisma.lost_reports.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: "Error updating lost report" });
  }
};
