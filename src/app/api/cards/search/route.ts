import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const cards = await prisma.card.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      set: true,
    },
    take: 10,
  });

  const results = cards.map((card) => {
    const attributes = card.attributes as {
      Rarity?: string;
    };

    return {
      id: card.id,
      name: card.name,
      set: card.set
        ? {
            name: card.set.name,
          }
        : null,
      attributes: {
        rarity: attributes.Rarity ?? null,
      },
    };
  });

  return NextResponse.json(results);
}
