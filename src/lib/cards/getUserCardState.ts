import prisma from "../prisma";

export async function getUserCardState(userId: string | null, cardId: string) {
  if (!userId) {
    return {
      wishlistItem: null,
      collectionItem: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return {
      wishlistItem: null,
      collectionItem: null,
    };
  }

  const [wishlistItem, collectionItem] = await Promise.all([
    prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        cardId,
      },
      include: {
        chaseRequest: {
          include: {
            offers: true,
          },
        },
      },
    }),
    prisma.collectionItem.findFirst({
      where: {
        userId: user.id,
        cardId,
      },
    }),
  ]);

  return {
    wishlistItem,
    collectionItem,
  };
}
