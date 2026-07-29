"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function addToChase(cardId: string, redirectUrl: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=" + encodeURIComponent(redirectUrl));
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existing = await prisma.chaseItem.findFirst({
    where: {
      userId: user.id,
      cardId,
    },
  });

  if (!existing) {
    await prisma.chaseItem.create({
      data: {
        userId: user.id,
        cardId,
      },
    });
  }

  revalidatePath(`/cards/${cardId}`);
}

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
