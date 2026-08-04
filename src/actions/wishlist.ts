"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function addToWishlist(cardId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_cardId: {
        userId: user.id,
        cardId,
      },
    },
  });

  if (existing) {
    if (existing.status === "ARCHIVED") {
      await prisma.wishlistItem.update({
        where: {
          id: existing.id,
        },
        data: {
          status: "ACTIVE",
        },
      });

      revalidatePath(`/cards/${cardId}`);

      return {
        success: true,
      };
    }

    throw new Error("Already in wishlist");
  }

  await prisma.wishlistItem.create({
    data: {
      userId: user.id,
      cardId,
      status: "ACTIVE",
    },
  });

  revalidatePath(`/cards/${cardId}`);

  return {
    success: true,
  };
}

export async function removeFromWishlist(
  wishlistItemId: string,
  cardId: string,
) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await prisma.wishlistItem.update({
    where: {
      id: wishlistItemId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidatePath(`/cards/${cardId}`);
}

type CreateChaseRequestInput = {
  cardId: string;

  price?: number | null;

  useRange: boolean;

  minPrice?: number | null;
  maxPrice?: number | null;

  conditions: string[];

  quantity: number;
};

export async function createChaseRequest({
  cardId,
  price,
  useRange,
  minPrice,
  maxPrice,
  conditions,
  quantity,
}: CreateChaseRequestInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    throw new Error("User does not exist");
  }

  if (conditions.length === 0) {
    throw new Error("At least one condition is required");
  }

  if (quantity < 1) {
    throw new Error("Invalid quantity");
  }

  if (useRange) {
    if (minPrice == null || maxPrice == null) {
      throw new Error("Invalid price range");
    }

    if (maxPrice < minPrice) {
      throw new Error("Invalid price range");
    }
  } else {
    if (price == null) {
      throw new Error("Price is required");
    }
  }

  let wishlistItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_cardId: {
        userId: user.id,
        cardId,
      },
    },
    include: {
      chaseRequests: true,
    },
  });

  if (!wishlistItem) {
    wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        cardId,
      },
      include: {
        chaseRequests: true,
      },
    });
  }

  const duplicate = wishlistItem.chaseRequests.find((request) => {
    return (
      request.status === "OPEN" &&
      (request.price?.toNumber() ?? null) === (price ?? null) &&
      request.useRange === useRange &&
      (request.minPrice?.toNumber() ?? null) === (minPrice ?? null) &&
      (request.maxPrice?.toNumber() ?? null) === (maxPrice ?? null) &&
      request.quantity === quantity &&
      JSON.stringify([...request.conditions].sort()) ===
        JSON.stringify([...conditions].sort())
    );
  });

  if (duplicate) {
    throw new Error("You already have a request with these conditions.");
  }

  const request = await prisma.chaseRequest.create({
    data: {
      wishlistItemId: wishlistItem.id,
      price: useRange ? null : price,
      useRange,
      minPrice: useRange ? minPrice : null,
      maxPrice: useRange ? maxPrice : null,
      conditions,
      quantity,
    },
  });

  revalidatePath(`/cards/${cardId}`);

  return {
    success: true,
    request: {
      ...request,
      price: request.price?.toNumber() ?? null,
      minPrice: request.minPrice?.toNumber() ?? null,
      maxPrice: request.maxPrice?.toNumber() ?? null,
    },
  };
}

export async function updateChaseRequest({
  requestId,
  price,
  useRange,
  minPrice,
  maxPrice,
  conditions,
  quantity,
}: {
  requestId: string;
  price?: number | null;
  useRange: boolean;
  minPrice?: number | null;
  maxPrice?: number | null;
  conditions: string[];
  quantity: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in");
  }

  const request = await prisma.chaseRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      wishlistItem: true,
    },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user || request.wishlistItem.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  const existingRequests = await prisma.chaseRequest.findMany({
    where: {
      wishlistItemId: request.wishlistItemId,
      NOT: {
        id: requestId,
      },
    },
  });

  const duplicate = existingRequests.find((request) => {
    return (
      request.status === "OPEN" &&
      (request.price?.toNumber() ?? null) === (price ?? null) &&
      request.useRange === useRange &&
      (request.minPrice?.toNumber() ?? null) === (minPrice ?? null) &&
      (request.maxPrice?.toNumber() ?? null) === (maxPrice ?? null) &&
      request.quantity === quantity &&
      JSON.stringify([...request.conditions].sort()) ===
        JSON.stringify([...conditions].sort())
    );
  });

  if (duplicate) {
    throw new Error("You already have a request with these conditions.");
  }

  const updatedRequest = await prisma.chaseRequest.update({
    where: {
      id: requestId,
    },
    data: {
      price: useRange ? null : price,
      useRange,
      minPrice: useRange ? minPrice : null,
      maxPrice: useRange ? maxPrice : null,
      conditions,
      quantity,
    },
  });

  revalidatePath(`/cards/${request.wishlistItem.cardId}/request`);

  return {
    success: true,
    request: {
      ...updatedRequest,
      price: updatedRequest.price?.toNumber() ?? null,
      minPrice: updatedRequest.minPrice?.toNumber() ?? null,
      maxPrice: updatedRequest.maxPrice?.toNumber() ?? null,
    },
  };
}
