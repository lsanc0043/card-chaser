import prisma from "../prisma";
import { UserCardState } from "../types";

export async function getUserCardState(
  userId: string | null,
  cardId: string,
): Promise<UserCardState> {
  if (!userId) {
    return {
      collectionItems: [],
      wishlistItem: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return {
      collectionItems: [],
      wishlistItem: null,
    };
  }

  const collectionItems = await prisma.collectionItem.findMany({
    where: {
      userId: user.id,
      cardId,
    },
  });

  const wishlistItem = await prisma.wishlistItem.findFirst({
    where: {
      userId: user.id,
      cardId,
      status: "ACTIVE",
    },
    include: {
      chaseRequests: {
        include: {
          offers: true,
        },
      },
    },
  });

  const serializedWishlistItem = wishlistItem
    ? {
        ...wishlistItem,
        chaseRequests: wishlistItem.chaseRequests.map((request) => ({
          ...request,
          price: request.price?.toNumber() ?? null,
          minPrice: request.minPrice?.toNumber() ?? null,
          maxPrice: request.maxPrice?.toNumber() ?? null,
          offers: request.offers.map((offer) => ({
            ...offer,
            price: offer.price.toNumber(),
          })),
        })),
      }
    : null;

  return {
    collectionItems,
    wishlistItem: serializedWishlistItem,
  };
}
