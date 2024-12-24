import bcrypt from "bcrypt";
import prisma from "../src/prisma";

export const initializeUsers = async () => {
  try {
    const users = [
      {
        name: "User",
        email: "user@user.com",
        password: "user",
        role: "user",
      },
      {
        name: "Admin",
        email: "admin@admin.com",
        password: "admin",
        role: "admin",
      },
      {
        name: "Employee",
        email: "employee@employee.com",
        password: "employee",
        role: "employee",
      },
      {
        name: "U",
        email: "u",
        password: "u",
        role: "user",
      },
      {
        name: "A",
        email: "a",
        password: "a",
        role: "admin",
      },
      {
        name: "E",
        email: "e",
        password: "e",
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
        console.log(`Stworzono ${user.name}.`);
      } else {
        console.log(`User ${user.name} już istnieje.`);
      }
    }
  } catch (error) {
    console.error("Error przy tworzeniu userow", error);
  }
};

export const initializeItems = async () => {
  try {
    const items = [
      {
        id: 1,
        name: "Czarny portfel",
        description: "Mały portfel z dokumentami i gotówką w środku.",
        category: "Akcesoria",
        location_found: "Park Miejski",
        status: "found",
      },
      {
        id: 2,
        name: "Srebrny pierścionek",
        description: "Pierścionek z wygrawerowanymi inicjałami.",
        category: "Biżuteria",
        location_found: "Kawiarnia Starówka",
        status: "found",
      },
      {
        id: 3,
        name: "Niebieski plecak",
        description: "Plecak z książkami i laptopem w środku.",
        category: "Plecaki",
        location_found: "Biblioteka Główna",
        status: "claimed",
      },
    ];

    for (const item of items) {
      const existingItem = await prisma.items.findFirst({
        where: { name: item.name },
      });
      if (!existingItem) {
        await prisma.items.create({ data: item });
        console.log(`Item ${item.name} stworzony.`);
      } else {
        console.log(`Item ${item.name} juz istnieje`);
      }
    }
  } catch (error) {
    console.error("Error przy tworzeniu itemow:", error);
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
      throw new Error("Brak userow.");
    }

    const lostReports = [
      {
        user_id: user1.id, // Poprawne przypisanie ID użytkownika
        name: "Portfel",
        date_reported: new Date().toISOString(),
        status: "pending",
        description: "Portfel z czarnej skóry",
        date_lost: new Date("2000-12-22"),
        location_lost: "Sala 34",
      },
      {
        user_id: user2.id,
        name: "Pierścionek",
        date_reported: new Date().toISOString(),
        status: "pending",
        description: "Srebrny pierścionek",
        date_lost: new Date("1000-12-22"),
        location_lost: "Sala 100 pod krzesłem obok okna",
      },
    ];

    for (const report of lostReports) {
      const existingReport = await prisma.lost_reports.findFirst({
        where: { user_id: report.user_id, name: report.name },
      });
      if (!existingReport) {
        await prisma.lost_reports.create({ data: report });
        console.log(`Zgłoszenie '${report.name}' zostało utworzone.`);
      } else {
        console.log(`Zgłoszenie '${report.name}' już istnieje.`);
      }
    }
  } catch (error) {
    console.error("Błąd inicjalizacji zgłoszeń o zagubieniach:", error);
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
        description:
          "Ten portfel należy do mnie, zgubiłem go w Parku Miejskim.",
        status: "pending",
        date_submitted: new Date().toISOString(),
      },
      {
        item_id: 2,
        user_id: user2.id,
        description: "Pamiątka rodzinna, pierścionek z inicjałami po babci.",
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
