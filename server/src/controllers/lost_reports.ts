import { Request, Response } from "express";
import prisma from "../prisma";


export const createLostReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; 
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
        status: "Oczekuje",
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
    const userId = (req as any).user.id; 

    const reports = await prisma.lost_reports.findMany({
      where: { user_id: userId },
      include: {
        item: true, 
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching user's lost reports:", error);
    res.status(500).json({ error: "Unable to fetch lost reports." });
  }
};

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

    if (!id || !itemId) {
      res.status(400).json({ error: "Report ID and Item ID are required." });
      return;
    }

    const report = await prisma.lost_reports.findUnique({
      where: { id: Number(id) },
    });
    if (!report) {
      res.status(404).json({ error: "Lost report not found." });
      return;
    }

    if (report.item_id) {
      res.status(400).json({ error: "This report already has an assigned item." });
      return;
    }

    const item = await prisma.items.findUnique({
      where: { id: Number(itemId) },
    });
    if (!item) {
      res.status(404).json({ error: "Item not found." });
      return;
    }

    if (item.status === "Przypisany") {
      res.status(400).json({ error: "This item is already assigned to another report." });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.lost_reports.update({
        where: { id: report.id },
        data: {
          item_id: item.id,
          status: "Zaakceptowane",
        },
      });
    
      await tx.items.update({
        where: { id: item.id },
        data: {
          status: "Przypisany",
          assigned_to: report.user_id,
        },
      });
    });
    
    const updatedReport = await prisma.lost_reports.findUnique({
      where: { id: report.id },
      include: {
        item: {
          include: {
            assignedTo: { 
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    res.json(updatedReport);
  } catch (error) {
    console.error("Error in assignItemToLostReport:", error);
    res.status(500).json({ error: "Error assigning item to lost report." });
  }
};
