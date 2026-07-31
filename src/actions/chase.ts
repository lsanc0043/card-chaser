"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function removeFromChase(chaseItemId: string, cardId: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await prisma.chaseItem.delete({
    where: {
      id: chaseItemId,
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

  // Validation
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

  let chaseItem = await prisma.chaseItem.findUnique({
    where: {
      userId_cardId: {
        userId: user.id,
        cardId,
      },
    },
    include: {
      request: true,
    },
  });

  if (!chaseItem) {
    chaseItem = await prisma.chaseItem.create({
      data: {
        userId: user.id,
        cardId,
      },
      include: {
        request: true,
      },
    });
  }

  if (chaseItem.request) {
    throw new Error("A request already exists for this card");
  }

  const request = await prisma.chaseRequest.create({
    data: {
      chaseItemId: chaseItem.id,

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
      chaseItem: true,
    },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  // Optional ownership check
  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user || request.chaseItem.userId !== user.id) {
    throw new Error("Unauthorized");
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

  revalidatePath(`/cards/${request.chaseItem.cardId}/request`);

  return {
    success: true,
    request: {
      ...updatedRequest,
      price: request.price?.toNumber() ?? null,
      minPrice: request.minPrice?.toNumber() ?? null,
      maxPrice: request.maxPrice?.toNumber() ?? null,
    },
  };
}
