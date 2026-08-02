-- AlterTable
ALTER TABLE "CollectionItem" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "purchasePrice" DECIMAL(65,30),
ALTER COLUMN "condition" SET DEFAULT 'Unknown';
