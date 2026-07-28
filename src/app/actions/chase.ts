"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function addToChase(cardId: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: "buyer@example.com",
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
  await prisma.chaseItem.delete({
    where: {
      id: chaseItemId,
    },
  });
}
