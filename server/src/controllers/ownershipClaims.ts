import { Request, Response } from "express";
import prisma from "../prisma";

export const createOwnershipClaim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; 
    const { item_id, description } = req.body;

    if (!item_id || !description) {
      res.status(400).json({ error: "item_id and description are required." });
      return;
    }

    const existingClaim = await prisma.ownership_claims.findFirst({
      where: { item_id, user_id: userId },
    });

    
    const newClaim = await prisma.ownership_claims.create({
      data: {
        user_id: userId,
        item_id,
        description,
        status: "Oczekuje",
        date_submitted: new Date(),
      },
    });

    res.status(201).json(newClaim);
  } catch (error) {
    console.error("Error creating ownership claim:", error);
    res.status(500).json({ error: "Unable to create ownership claim." });
  }
};

export const getOwnershipClaims = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const statusFilter = req.query.status as string | undefined;

    const skip = (page - 1) * limit;

    let whereClause: any = {};
    if (statusFilter && statusFilter !== "all") {
      whereClause.status = statusFilter;
    }

    const claims = await prisma.ownership_claims.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        user: true,
        item: true,
        verifiedBy: true,
      },
    });

    const totalCount = await prisma.ownership_claims.count({
      where: whereClause,
    });

    res.json({
      data: claims,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching ownership claims:", error);
    res.status(500).json({ error: "Error fetching ownership claims" });
  }
};


export const updateOwnershipClaim = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employeeId = (req as any).user.id;

    if (!["Oczekuje", "Zaakceptowane", "Odrzucone"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const currentClaim = await prisma.ownership_claims.findUnique({
      where: { id: Number(id) },
    });

    if (!currentClaim) {
      return res.status(404).json({ error: "Claim not found." });
    }

    if (status === "Zaakceptowane" && !currentClaim.item_id) {
      return res.status(400).json({ error: "No item associated with this claim." });
    }

    const item = await prisma.items.findUnique({
      where: { id: currentClaim.item_id },
    });

    if (status === "Zaakceptowane" && !item) {
      return res.status(404).json({ error: "Associated item not found." });
    }

    await prisma.$transaction(async (tx) => {

      await tx.ownership_claims.update({
        where: { id: Number(id) },
        data: {
          status,
          verified_by: employeeId,
        },
      });

      if (status === "Zaakceptowane") {
        await tx.items.update({
          where: { id: currentClaim.item_id },
          data: {
            status: "Przypisany",
            assigned_to: currentClaim.user_id, 
          },
        });
      }
    });

    const finalClaim = await prisma.ownership_claims.findUnique({
      where: { id: Number(id) },
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
        verifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(finalClaim);
  } catch (error) {
    console.error("Error updating ownership claim:", error);
    res.status(500).json({ error: "Error updating ownership claim." });
  }
};


export const getUserOwnershipClaims = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; 

    
    const claims = await prisma.ownership_claims.findMany({
      where: { user_id: userId },
      include: {
        item: true, 
      },
    });

    res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching user's ownership claims:", error);
    res.status(500).json({ error: "Unable to fetch ownership claims." });
  }
};
