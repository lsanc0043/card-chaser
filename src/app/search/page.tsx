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
    <main
      style={{
        padding: "32px",
        maxWidth: "1024px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "24px",
        }}
      >
        Search Cards
      </h1>

      <CardSearch />

      {query && (
        <p
          style={{
            color: "#6b7280",
            marginTop: "24px",
            marginBottom: "16px",
          }}
        >
          {`Showing ${cards.length} result${cards.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      <div>
        {cards.length === 0 ? (
          <p>No cards found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
            }}
          >
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="hover:shadow-lg transition-shadow"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {card.name}
                </h2>

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
