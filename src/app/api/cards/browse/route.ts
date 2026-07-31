import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q");
  const tcg = searchParams.get("tcg");
  const set = searchParams.get("set");
  const rarity = searchParams.get("rarity");

  const cards = await prisma.card.findMany({
    where: {
      ...(q && {
        name: {
          contains: q,
          mode: "insensitive",
        },
      }),

      ...(tcg && {
        tcg: {
          externalId: tcg,
        },
      }),

      ...(set && {
        set: {
          slug: set,
        },
      }),

      ...(rarity && {
        attributes: {
          path: ["Rarity"],
          equals: rarity,
        },
      }),
    },

    include: {
      set: true,
      tcg: true,
      image: true,
    },

    take: 5,
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
