import prisma from "@/lib/prisma";

export async function GET() {
  const cards = await prisma.card.findMany();

  return Response.json(cards);
}
