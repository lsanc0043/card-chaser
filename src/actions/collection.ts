"use server";

import { CONDITIONS } from "@/lib/cards/constants";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveCollection({
  cardId,
  quantities,
}: {
  cardId: string;
  quantities: Record<string, number>;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.$transaction(async (tx) => {
    for (const condition of CONDITIONS) {
      const quantity = quantities[condition] ?? 0;

      const existing = await tx.collectionItem.findUnique({
        where: {
          userId_cardId_condition: {
            userId: user.id,
            cardId,
            condition,
          },
        },
      });

      if (quantity > 0) {
        if (existing) {
          await tx.collectionItem.update({
            where: {
              id: existing.id,
            },
            data: {
              quantity,
            },
          });
        } else {
          await tx.collectionItem.create({
            data: {
              userId: user.id,
              cardId,
              condition,
              quantity,
            },
          });
        }
      }

      if (quantity === 0 && existing) {
        await tx.collectionItem.delete({
          where: {
            id: existing.id,
          },
        });
      }
    }
  });

  revalidatePath(`/cards/${cardId}`);
  revalidatePath("/collection");
}

export async function removeFromCollection(cardId: string) {
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

  await prisma.collectionItem.deleteMany({
    where: {
      userId: user.id,
      cardId,
    },
  });

  revalidatePath(`/cards/${cardId}`);
  revalidatePath("/collection");
}
