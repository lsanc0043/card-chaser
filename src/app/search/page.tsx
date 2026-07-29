import CardSearch from "@/components/card-search";
import prisma from "@/lib/prisma";
import CardDisplay from "@/components/card-display";

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
    include: {
      set: true,
      tcg: true,
      image: true,
    },
  });

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
        Search Cards
      </h1>

      <div style={{ marginBottom: "10px" }}>
        <CardSearch />
      </div>

      {query && (
        <p
          style={{
            color: "#6b7280",
            margin: "10px",
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
