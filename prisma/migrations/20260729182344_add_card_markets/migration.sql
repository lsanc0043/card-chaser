-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "markets" JSONB,
ALTER COLUMN "updatedAt" DROP DEFAULT;
