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

  const charizard = await prisma.card.upsert({
    where: {
      externalId: 67617,
    },
    update: {},
    create: {
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

  const onePiece = await prisma.tcg.upsert({
    where: {
      externalId: "one-piece",
    },
    update: {},
    create: {
      externalId: "one-piece",
      name: "One Piece",
      description: "One Piece Card Game",
    },
  });

  const pillarsOfStrength = await prisma.set.upsert({
    where: {
      externalId: "one-piece-pillars-of-strength",
    },
    update: {},
    create: {
      externalId: "one-piece-pillars-of-strength",
      name: "Pillars of Strength",
      code: "OP03",
      slug: "pillars-of-strength",
      releaseDate: new Date("2023-06-30"),
      tcgId: onePiece.id,
    },
  });

  const luffy = await prisma.card.upsert({
    where: {
      externalId: 9804,
    },
    update: {},

    create: {
      externalId: 9804,
      name: "Monkey.D.Luffy",
      type: "card",

      tcgId: onePiece.id,
      setId: pillarsOfStrength.id,

      image: {
        create: {
          small: "https://tcgplayer-cdn.tcgplayer.com/product/500009_200w.jpg",
          medium: "https://tcgplayer-cdn.tcgplayer.com/product/500009_400w.jpg",
          large:
            "https://tcgplayer-cdn.tcgplayer.com/product/500009_in_1000x1000.jpg",
        },
      },

      markets: {
        tcgplayer: {
          id: "500009",
          url: "https://www.tcgplayer.com/product/500009/one-piece-card-game-pillars-of-strength-monkeydluffy",
          prices: {
            low: 0.05,
            mid: 0.38,
            high: 100,
            market: 0.36,
          },
        },
      },

      attributes: {
        Rarity: "R",
        Number: "OP03-070",
        Description:
          "[On Play] DON!! -1 <em>(You may return the specified number of DON!! cards from your field to your DON!! deck.)</em> <strong>You may trash 1 Character card with a cost of 5 from your hand</strong>: This Character gains [Rush] during this turn. <em>(This card can attack on the turn in which it is played.)</em>",
        Color: "Purple",
        CardType: "Character",
        Cost: "6",
        Power: "7000",
        Subtypes: "Straw Hat Crew;Water Seven",
        Attribute: "Strike",
        Artist: "Nekobayashi",
      },
    },
  });

  console.log("Card added:", luffy.name);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
