/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `setName` on the `Card` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "imageUrl",
DROP COLUMN "rarity",
DROP COLUMN "setName",
ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "externalId" INTEGER,
ADD COLUMN     "setId" TEXT,
ADD COLUMN     "tcgId" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Tcg" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tcg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "slug" TEXT,
    "releaseDate" TIMESTAMP(3),
    "tcgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardImage" (
    "id" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "CardImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardPrice" (
    "id" TEXT NOT NULL,
    "tcgplayerId" TEXT,
    "low" DOUBLE PRECISION,
    "mid" DOUBLE PRECISION,
    "high" DOUBLE PRECISION,
    "market" DOUBLE PRECISION,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "CardPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tcg_externalId_key" ON "Tcg"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Set_externalId_key" ON "Set"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "CardImage_cardId_key" ON "CardImage"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardPrice_cardId_key" ON "CardPrice"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_externalId_key" ON "Card"("externalId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "Tcg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "Tcg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardImage" ADD CONSTRAINT "CardImage_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardPrice" ADD CONSTRAINT "CardPrice_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
