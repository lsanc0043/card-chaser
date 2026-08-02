import prisma from "@/lib/prisma";

export async function getCard(id: string) {
  return prisma.card.findUnique({
    where: {
      id,
    },
    include: {
      set: true,
      tcg: true,
      image: true,
    },
  });
}
