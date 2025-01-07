/*
  Warnings:

  - The `status` column on the `items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `ownership_claims` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `lost_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('Znaleziony', 'Przypisany', 'Zwrocony', 'Zarchiwizowany');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Oczekuje', 'Zaakceptowane', 'Odrzucone');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('Oczekuje', 'Zaakceptowane', 'Odrzucone');

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "assigned_to" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'Znaleziony';

-- AlterTable
ALTER TABLE "lost_reports" DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" NOT NULL;

-- AlterTable
ALTER TABLE "ownership_claims" DROP COLUMN "status",
ADD COLUMN     "status" "ClaimStatus" NOT NULL DEFAULT 'Oczekuje';

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
