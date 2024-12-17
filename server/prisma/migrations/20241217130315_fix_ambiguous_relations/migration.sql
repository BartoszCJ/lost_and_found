-- DropForeignKey
ALTER TABLE "item_history" DROP CONSTRAINT "item_history_item_id_fkey";

-- DropForeignKey
ALTER TABLE "item_history" DROP CONSTRAINT "item_history_performed_by_fkey";

-- DropForeignKey
ALTER TABLE "lost_reports" DROP CONSTRAINT "lost_reports_item_id_fkey";

-- DropForeignKey
ALTER TABLE "lost_reports" DROP CONSTRAINT "lost_reports_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ownership_claims" DROP CONSTRAINT "ownership_claims_item_id_fkey";

-- DropForeignKey
ALTER TABLE "ownership_claims" DROP CONSTRAINT "ownership_claims_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ownership_claims" DROP CONSTRAINT "ownership_claims_verified_by_fkey";

-- AlterTable
ALTER TABLE "ownership_claims" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "item_history" ADD CONSTRAINT "item_history_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_history" ADD CONSTRAINT "item_history_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownership_claims" ADD CONSTRAINT "ownership_claims_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownership_claims" ADD CONSTRAINT "ownership_claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownership_claims" ADD CONSTRAINT "ownership_claims_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
