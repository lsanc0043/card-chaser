import { buildCardWhere } from "@/lib/cards/buildCardWhere";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters = {
    query: searchParams.get("q") ?? undefined,
    tcg: searchParams.get("tcg")?.split(","),
    rarity: searchParams.get("rarity")?.split(","),
    set: searchParams.get("set")?.split(","),
  };

  const cards = await prisma.card.findMany({
    where: buildCardWhere(filters),
    include: {
      set: true,
      tcg: true,
      image: true,
    },
    take: 5,
  });

  return NextResponse.json(cards);
}
