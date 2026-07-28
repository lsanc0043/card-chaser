import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const seller = await prisma.user.findUnique({
    where: {
      email: "seller@example.com",
    },
  });

  if (!seller) {
    return Response.json({ error: "Seller not found" }, { status: 400 });
  }

  const offer = await prisma.offer.create({
    data: {
      sellerId: seller.id,
      chaseItemId: body.chaseItemId,
      price: Number(body.price),
      condition: body.condition,
      status: "PENDING",
    },
  });

  return Response.json(offer);
}
