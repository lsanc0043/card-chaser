import { Prisma } from "@prisma/client";

type Filters = {
  query?: string;
  tcgs?: string[];
  rarities?: string[];
  sets?: string[];
};

export function buildCardWhere({
  query,
  tcgs = [],
  rarities = [],
  sets = [],
}: Filters): Prisma.CardWhereInput {
  return {
    ...(query && {
      name: {
        contains: query,
        mode: "insensitive",
      },
    }),

    ...(tcgs.length > 0 && {
      tcg: {
        externalId: {
          in: tcgs,
        },
      },
    }),

    ...(rarities.length > 0 && {
      OR: rarities.map((rarity) => ({
        attributes: {
          path: ["Rarity"],
          equals: rarity,
        },
      })),
    }),

    ...(sets.length > 0 && {
      set: {
        name: {
          in: sets,
          mode: "insensitive",
        },
      },
    }),
  };
}
