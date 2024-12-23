import bcrypt from "bcrypt";
import prisma from "../src/prisma";

export const initializeUsers = async () => {
  try {
    const users = [
      {
        id: 1,
        name: "User",
        email: "user@user.com",
        password: "user",
        role: "user",
      },
      {
        id: 2,
        name: "Admin",
        email: "admin@admin.com",
        password: "admin",
        role: "admin",
      },
      {
        id: 3,
        name: "Employee",
        email: "employee@employee.com",
        password: "employee",
        role: "employee",
      },
    ];

    for (const user of users) {
      const existingUser = await prisma.users.findUnique({
        where: { email: user.email },
      });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.users.create({
          data: {
            name: user.name,
            email: user.email,
            password: hashedPassword,
            role: user.role,
          },
        });
        console.log(`User ${user.name} created.`);
      } else {
        console.log(`User ${user.name} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error initializing users:", error);
  }
};

export const initializeItems = async () => {
  try {
    const items = [
      {
        id: 1,
        name: "Black Wallet",
        description: "A small black wallet with cards inside.",
        category: "Accessories",
        location_found: "Central Park",
        status: "found",
      },
      {
        id: 2,
        name: "Silver Ring",
        description: "A silver ring with an engraving.",
        category: "Jewelry",
        location_found: "Coffee Shop",
        status: "unclaimed",
      },
      {
        id: 3,
        name: "Blue Backpack",
        description: "A large blue backpack with books.",
        category: "Bags",
        location_found: "Library",
        status: "claimed",
      },
    ];

    for (const item of items) {
      const existingItem = await prisma.items.findFirst({
        where: { name: item.name },
      });
      if (!existingItem) {
        await prisma.items.create({ data: item });
        console.log(`Item ${item.name} created.`);
      } else {
        console.log(`Item ${item.name} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error initializing items:", error);
  }
};

export const initializeLostReports = async () => {
  try {
    const user1 = await prisma.users.findUnique({
      where: { email: "user@user.com" },
    });
    const user2 = await prisma.users.findUnique({
      where: { email: "admin@admin.com" },
    });
    if (!user1 || !user2) {
      throw new Error(
        "Required users not found. Please initialize users first."
      );
    }
    const lostReports = [
      {
        user_id: user1?.id,
        item_id: 1,
        date_reported: new Date().toISOString(),
        status: "pending",
      },
      {
        user_id: user2?.id,
        item_id: 2,
        date_reported: new Date().toISOString(),
        status: "resolved",
      },
    ];

    for (const report of lostReports) {
      const existingReport = await prisma.lost_reports.findFirst({
        where: { user_id: report.user_id, item_id: report.item_id },
      });
      if (!existingReport) {
        await prisma.lost_reports.create({ data: report });
        console.log(`Lost Report for item ${report.item_id} created.`);
      } else {
        console.log(`Lost Report for item ${report.item_id} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error initializing lost reports:", error);
  }
};

export const initializeOwnershipClaims = async () => {
  try {
    const user1 = await prisma.users.findUnique({
      where: { email: "user@user.com" },
    });
    const user2 = await prisma.users.findUnique({
      where: { email: "admin@admin.com" },
    });

    if (!user1 || !user2) {
      console.error("Brak wymaganych użytkowników lub przedmiotów.");
      return;
    }

    const ownershipClaims = [
      {
        item_id: 1,
        user_id: user1.id,
        description: "I lost this wallet in Central Park.",
        status: "pending",
        date_submitted: new Date().toISOString(),
      },
      {
        item_id: 2,
        user_id: user2.id,
        description: "This ring was a gift from my grandmother.",
        status: "approved",
        date_submitted: new Date().toISOString(),
      },
    ];

    for (const claim of ownershipClaims) {
      const existingClaim = await prisma.ownership_claims.findFirst({
        where: { item_id: claim.item_id, user_id: claim.user_id },
      });

      if (!existingClaim) {
        await prisma.ownership_claims.create({ data: claim });
        console.log(`Ownership Claim for item ${claim.item_id} created.`);
      } else {
        console.log(
          `Ownership Claim for item ${claim.item_id} already exists.`
        );
      }
    }
  } catch (error) {
    console.error("Error initializing ownership claims:", error);
  }
};
