/*
  Warnings:

  - You are about to drop the `CardPrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardPrice" DROP CONSTRAINT "CardPrice_cardId_fkey";

-- DropTable
DROP TABLE "CardPrice";
