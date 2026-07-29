"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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

  redirect("/chase");
}

export async function removeFromChase(chaseItemId: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.chaseItem.deleteMany({
    where: {
      id: chaseItemId,
      userId: user.id,
    },
  });

  redirect("/chase");
}
