import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const pokemon = await prisma.tcg.upsert({
    where: {
      externalId: "pokemon",
    },
    update: {},
    create: {
      externalId: "pokemon",
      name: "Pokémon",
      description: "Pokémon TCG",
    },
  });

  const baseSet = await prisma.set.upsert({
    where: {
      externalId: "pokemon-base-set",
    },
    update: {},
    create: {
      externalId: "pokemon-base-set",
      name: "Base Set",
      code: "BS",
      slug: "base-set",
      releaseDate: new Date("1999-01-09"),
      tcgId: pokemon.id,
    },
  });

  const charizard = await prisma.card.create({
    data: {
      externalId: 67617,
      name: "Charizard",
      type: "card",

      tcgId: pokemon.id,
      setId: baseSet.id,

      image: {
        create: {
          small: "https://tcgplayer-cdn.tcgplayer.com/product/42382_200w.jpg",
          medium: "https://tcgplayer-cdn.tcgplayer.com/product/42382_400w.jpg",
          large:
            "https://tcgplayer-cdn.tcgplayer.com/product/42382_in_1000x1000.jpg",
        },
      },

      markets: {
        tcgplayer: {
          id: "42382",
          url: "https://www.tcgplayer.com/product/42382/pokemon-base-set-charizard",
          prices: {
            low: 510,
            mid: 919.49,
            high: 4590.63,
            market: 800.43,
          },
        },
      },

      attributes: {
        Number: "004/102",
        Rarity: "Holo Rare",
        "Card Type": "Fire",
        HP: "120",
        Stage: "Stage 2",

        CardText:
          "<strong>Pokémon Power: Energy Burn</strong> As often as you like during your turn.",

        "Attack 1":
          "[RRRR] Fire Spin (100)\r\n<br>Discard 2 Energy cards attached to Charizard in order to use this attack.",

        Weakness: "W",
        Resistance: "F-30",
        RetreatCost: "3",
      },
    },
  });

  console.log("Card seed complete:", charizard.name);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
