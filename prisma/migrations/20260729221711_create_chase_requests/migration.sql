/*
  Warnings:

  - You are about to drop the column `chaseItemId` on the `Offer` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[userId,cardId]` on the table `ChaseItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chaseRequestId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_chaseItemId_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "chaseItemId",
ADD COLUMN     "chaseRequestId" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "ChaseRequest" (
    "id" TEXT NOT NULL,
    "chaseItemId" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "useRange" BOOLEAN NOT NULL DEFAULT false,
    "minPrice" DECIMAL(65,30),
    "maxPrice" DECIMAL(65,30),
    "conditions" TEXT[],
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChaseRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChaseRequest_chaseItemId_key" ON "ChaseRequest"("chaseItemId");

-- CreateIndex
CREATE INDEX "ChaseRequest_conditions_idx" ON "ChaseRequest"("conditions");

-- CreateIndex
CREATE INDEX "ChaseItem_status_idx" ON "ChaseItem"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ChaseItem_userId_cardId_key" ON "ChaseItem"("userId", "cardId");

-- CreateIndex
CREATE INDEX "Offer_status_idx" ON "Offer"("status");

-- CreateIndex
CREATE INDEX "Offer_chaseRequestId_idx" ON "Offer"("chaseRequestId");

-- AddForeignKey
ALTER TABLE "ChaseRequest" ADD CONSTRAINT "ChaseRequest_chaseItemId_fkey" FOREIGN KEY ("chaseItemId") REFERENCES "ChaseItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_chaseRequestId_fkey" FOREIGN KEY ("chaseRequestId") REFERENCES "ChaseRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
