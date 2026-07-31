import CardSearch from "@/components/cards/card-search";
import prisma from "@/lib/prisma";
import CardDisplay from "@/components/cards/card-display";
import ActiveFilters from "@/components/cards/active-filters";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tcg?: string;
    rarity?: string;
    set?: string;
  }>;
}) {
  const { q: query, tcg, rarity, set } = await searchParams;

  const cards = await prisma.card.findMany({
    where: {
      ...(query && {
        name: {
          contains: query,
          mode: "insensitive",
        },
      }),

      ...(tcg && {
        tcg: {
          externalId: tcg,
        },
      }),

      ...(rarity && {
        attributes: {
          path: ["Rarity"],
          equals: rarity,
        },
      }),

      ...(set && {
        set: {
          name: {
            equals: set,
            mode: "insensitive",
          },
        },
      }),
    },
    orderBy: {
      name: "asc",
    },
    include: {
      set: true,
      tcg: true,
      image: true,
    },
  });

  const hasFilters = query || tcg || rarity || set;

  return (
    <main
      style={{
        padding: "10px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "10px",
        }}
      >
        Browse Cards
      </h1>

      <div style={{ marginBottom: "10px", display: "flex", gap: 10 }}>
        <CardSearch key={`${tcg}-${rarity}-${set}`} />
      </div>

      <ActiveFilters />

      {hasFilters && cards.length > 0 && (
        <p
          style={{
            color: "#6b7280",
            margin: "5px 5px 10px",
          }}
        >
          Showing {cards.length} card{cards.length !== 1 ? "s" : ""}
        </p>
      )}

      <div>
        {cards.length === 0 ? (
          <p
            style={{
              color: "#6b7280",
              margin: "5px 5px 10px",
            }}
          >
            No cards found. Try adjusting your search or filters.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 220px)",
              gap: "24px",
              justifyContent: "start",
            }}
          >
            {cards.map((card) => {
              return <CardDisplay card={card} key={card.id} />;
            })}
          </div>
        )}
      </div>
    </main>
  );
}
