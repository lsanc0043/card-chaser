-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_chaseItemId_fkey";

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_chaseItemId_fkey" FOREIGN KEY ("chaseItemId") REFERENCES "ChaseItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
