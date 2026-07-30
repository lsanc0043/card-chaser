import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const seller = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!seller) {
    return Response.json({ error: "User not found" }, { status: 400 });
  }

  const offer = await prisma.offer.upsert({
    where: {
      sellerId_chaseRequestId: {
        sellerId: seller.id,
        chaseRequestId: body.chaseRequestId,
      },
    },
    update: {
      price: Number(body.price),
      condition: body.condition,
      status: "PENDING",
      message: body.message,
    },
    create: {
      sellerId: seller.id,
      chaseRequestId: body.chaseRequestId,
      price: Number(body.price),
      condition: body.condition,
      status: "PENDING",
      message: body.message,
    },
  });

  return Response.json(offer);
}
