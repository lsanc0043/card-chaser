/*
  Wishlist / Collection restructure migration

  Converts:
  ChaseItem -> WishlistItem

  Preserves:
  - Users
  - Existing ChaseRequests
  - Existing Offers
*/


-- Remove old foreign keys
ALTER TABLE "ChaseItem"
DROP CONSTRAINT "ChaseItem_cardId_fkey";

ALTER TABLE "ChaseItem"
DROP CONSTRAINT "ChaseItem_userId_fkey";

ALTER TABLE "ChaseRequest"
DROP CONSTRAINT "ChaseRequest_chaseItemId_fkey";


-- Remove old unique index
DROP INDEX "ChaseRequest_chaseItemId_key";


-- Create WishlistItem table
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);


-- Copy ChaseItems into WishlistItems
INSERT INTO "WishlistItem" (
    "id",
    "userId",
    "cardId",
    "createdAt"
)
SELECT
    "id",
    "userId",
    "cardId",
    "createdAt"
FROM "ChaseItem";


-- Add temporary nullable column
ALTER TABLE "ChaseRequest"
ADD COLUMN "wishlistItemId" TEXT;


-- Connect existing ChaseRequests to new WishlistItems
UPDATE "ChaseRequest"
SET "wishlistItemId" = "chaseItemId";


-- Make new column required
ALTER TABLE "ChaseRequest"
ALTER COLUMN "wishlistItemId" SET NOT NULL;


-- Add new relationship
ALTER TABLE "ChaseRequest"
ADD CONSTRAINT "ChaseRequest_wishlistItemId_fkey"
FOREIGN KEY ("wishlistItemId")
REFERENCES "WishlistItem"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;


-- Remove old relationship column
ALTER TABLE "ChaseRequest"
DROP COLUMN "chaseItemId";


-- Add quantity support to offers
ALTER TABLE "Offer"
ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;


-- Create CollectionItem table
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "condition" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);


-- Create indexes
CREATE UNIQUE INDEX "CollectionItem_userId_cardId_condition_key"
ON "CollectionItem"("userId", "cardId", "condition");


CREATE UNIQUE INDEX "WishlistItem_userId_cardId_key"
ON "WishlistItem"("userId", "cardId");


CREATE UNIQUE INDEX "ChaseRequest_wishlistItemId_key"
ON "ChaseRequest"("wishlistItemId");


-- Add CollectionItem relationships
ALTER TABLE "CollectionItem"
ADD CONSTRAINT "CollectionItem_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE "CollectionItem"
ADD CONSTRAINT "CollectionItem_cardId_fkey"
FOREIGN KEY ("cardId")
REFERENCES "Card"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


-- Add WishlistItem relationships
ALTER TABLE "WishlistItem"
ADD CONSTRAINT "WishlistItem_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE "WishlistItem"
ADD CONSTRAINT "WishlistItem_cardId_fkey"
FOREIGN KEY ("cardId")
REFERENCES "Card"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;


-- Remove old ChaseItem table
DROP TABLE "ChaseItem";