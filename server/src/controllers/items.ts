import { Request, Response } from "express";
import prisma from "../prisma";

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    const items = await prisma.items.findMany({
      where: search
        ? {
            name: {
              contains: String(search),
              mode: "insensitive",
            },
          }
        : {},
    });

    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error); 
    res.status(500).json({ error: "Unable to fetch items." });
  }
};

export const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, location_found, date_found, status } =
      req.body;

    
    if (!name || !category) {
      res.status(400).json({ error: "Nazwa i kategoria są wymagane." });
      return; 
    }

    let dateFoundValue: Date | null = null;
    if (date_found) {
      dateFoundValue = new Date(date_found);
      if (isNaN(dateFoundValue.getTime())) {
        res.status(400).json({ error: "Niepoprawny format daty." });
        return;
      }
    }

    const newItem = await prisma.items.create({
      data: {
        name,
        description,
        category,
        location_found,
        date_found: dateFoundValue,
        status: status || "found",
      },
    });

    res.status(201).json(newItem); 
  } catch (error) {
    console.error("Error in addItem:", error);
    res.status(500).json({ error: "Unable to add item." });
  }
};
