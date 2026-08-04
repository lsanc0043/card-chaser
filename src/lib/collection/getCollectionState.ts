import prisma from "@/lib/prisma";

export async function getCollectionState(userId: string, cardId: string) {
  const items = await prisma.collectionItem.findMany({
    where: {
      userId,
      cardId,
    },
  });

  return Object.fromEntries(
    items.map((item) => [item.condition, item.quantity]),
  );
}
