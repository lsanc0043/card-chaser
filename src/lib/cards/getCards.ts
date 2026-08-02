import prisma from "@/lib/prisma";
import { buildCardWhere } from "./buildCardWhere";

type CardFilters = {
  query?: string;
  tcg?: string;
  rarity?: string;
  set?: string;
};

export async function getCards(filters: CardFilters) {
  return prisma.card.findMany({
    where: buildCardWhere(filters),
    orderBy: {
      name: "asc",
    },
    include: {
      set: true,
      tcg: true,
      image: true,
    },
  });
}
