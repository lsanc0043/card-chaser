/*
  Warnings:

  - Made the column `attributes` on table `Card` required. This step will fail if there are existing NULL values in that column.
  - Made the column `externalId` on table `Card` required. This step will fail if there are existing NULL values in that column.
  - Made the column `setId` on table `Card` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tcgId` on table `Card` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_setId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_tcgId_fkey";

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "attributes" SET NOT NULL,
ALTER COLUMN "externalId" SET NOT NULL,
ALTER COLUMN "setId" SET NOT NULL,
ALTER COLUMN "tcgId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "Tcg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
