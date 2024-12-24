/*
  Warnings:

  - You are about to drop the column `date_found` on the `lost_reports` table. All the data in the column will be lost.
  - You are about to drop the column `location_found` on the `lost_reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lost_reports" DROP COLUMN "date_found",
DROP COLUMN "location_found",
ADD COLUMN     "date_lost" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location_lost" TEXT NOT NULL DEFAULT '';
