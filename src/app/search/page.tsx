import CardSearch from "@/components/card-search";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;

  const cards = await prisma.card.findMany({
    where: query
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {},
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Cards</h1>

      {/* TODO: add debounce */}
      <CardSearch />

      {query && (
        <p className="text-gray-500 mb-4 mt-6">
          {`Showing ${cards.length} result${cards.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      <div className="space-y-4">
        {cards.length === 0 ? (
          <p>No cards found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="border rounded-lg p-4 hover:shadow"
              >
                <h2 className="font-bold">{card.name}</h2>

                <p>{card.setName}</p>

                <p>{card.rarity}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
