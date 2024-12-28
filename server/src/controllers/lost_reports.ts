import { Request, Response } from "express";
import prisma from "../prisma";

// Dodanie nowego zgłoszenia o zgubieniu
export const createLostReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; // ID użytkownika z JWT
    const { name, description, location_lost, date_lost } = req.body;

    if (!name || !description || !location_lost || !date_lost) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const newLostReport = await prisma.lost_reports.create({
      data: {
        user_id: userId,
        name,
        description,
        location_lost,
        date_lost: new Date(date_lost),
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
export const getLostReports = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const statusFilter = req.query.status as string | undefined;

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (statusFilter && statusFilter !== "all") {
      whereClause.status = statusFilter;
    }

    const [reports, totalCount] = await Promise.all([
      prisma.lost_reports.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: { user: true, item: true },
        orderBy: { id: "desc" },
      }),
      prisma.lost_reports.count({ where: whereClause }),
    ]);

    res.json({
      data: reports,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
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

export const assignItemToLostReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { itemId } = req.body;

    // Find the lost report
    const report = await prisma.lost_reports.findUnique({
      where: { id: Number(id) },
    });
    if (!report) {
      res.status(404).json({ error: "Lost report not found." });
      return;
    }

    // Find the item
    const item = await prisma.items.findUnique({
      where: { id: Number(itemId) },
    });
    if (!item) {
      res.status(404).json({ error: "Item not found." });
      return;
    }

    // Update the lost report and item in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.lost_reports.update({
        where: { id: report.id },
        data: {
          item_id: item.id,
          status: "resolved",
        },
      });

      await tx.items.update({
        where: { id: item.id },
        data: { status: "claimed" },
      });
    });

    // Fetch the updated report with related data
    const updatedReport = await prisma.lost_reports.findUnique({
      where: { id: Number(id) },
      include: { user: true, item: true },
    });

    res.json(updatedReport);
  } catch (error) {
    console.error("Error in assignItemToLostReport:", error);
    res.status(500).json({ error: "Error assigning item to lost report." });
  }
};
