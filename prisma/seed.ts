// npx prisma migrate reset
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.offer.deleteMany();
  await prisma.chaseItem.deleteMany();
  await prisma.card.deleteMany();

  // Create cards
  const charizard = await prisma.card.create({
    data: {
      name: "Charizard",
      setName: "Base Set",
      rarity: "Holo Rare",
      imageUrl: "https://images.pokemontcg.io/base1/4.png",
    },
  });

  const pikachu = await prisma.card.create({
    data: {
      name: "Pikachu",
      setName: "Base Set",
      rarity: "Common",
      imageUrl: "https://images.pokemontcg.io/base1/58.png",
    },
  });

  // Buyer creates a chase request
  const chaseItem = await prisma.chaseItem.create({
    data: {
      userId: buyer.id,
      cardId: charizard.id,
      status: "OPEN",
    },
  });

  // Seller responds with an offer
  await prisma.offer.create({
    data: {
      sellerId: seller.id,
      chaseItemId: chaseItem.id,
      price: 250,
      condition: "Near Mint",
      message: "I have this card available and can ship immediately.",
      status: "PENDING",
    },
  });

  console.log("Seed complete!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
