/*
  Warnings:

  - Made the column `date_reported` on table `lost_reports` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "lost_reports" DROP CONSTRAINT "lost_reports_user_id_fkey";

-- AlterTable
ALTER TABLE "lost_reports" ADD COLUMN     "date_found" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "location_found" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "date_reported" SET NOT NULL,
ALTER COLUMN "date_reported" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
