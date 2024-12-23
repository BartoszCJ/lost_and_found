import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Prisma middleware
prisma.$use(async (params, next) => {
  // Sprawdź, czy to dotyczy ownership_claims i akcji update
  if (
    params.model === "ownership_claims" &&
    params.action === "update"
  ) {
    // POBIERZ z "params.args.data", czy zmienia się status na "approved"
    // ALE musisz też pobrać stary stan, żeby wiedzieć, czy wcześniej nie był "approved"
    // i np. item_id

    // 1) Najpierw wywołaj oryginalny update, żeby dostać newRecord (to jest "NEW" w SQL)
    const updatedClaim = await next(params);

    // 2) Jeśli updatedClaim.status === "approved", to zrób update items
    if (updatedClaim.status === "approved") {
      await prisma.items.update({
        where: { id: updatedClaim.item_id },
        data: { status: "claimed" },
      });
    }

    // Zwróć updatedClaim do oryginalnego wywołania
    return updatedClaim;
  }

  // Jeśli nie pasuje, po prostu wykonaj oryginalną akcję
  return next(params);
});

export default prisma;
