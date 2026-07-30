/*
  Warnings:

  - A unique constraint covering the columns `[sellerId,chaseRequestId]` on the table `Offer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Offer_sellerId_chaseRequestId_key" ON "Offer"("sellerId", "chaseRequestId");
