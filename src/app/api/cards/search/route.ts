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
    take: 8,
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(cards);
}
