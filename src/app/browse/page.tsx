import CardSearch from "@/components/cards/card-search";
import CardDisplay from "@/components/cards/card-display";
import ActiveFilters from "@/components/cards/active-filters";
import { getCardFilters } from "@/lib/cards/getCardFilters";
import { getCards } from "@/lib/cards/getCards";

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
  const filters = await getCardFilters(searchParams);

  const cards = await getCards(filters);

  const hasFilters = Object.values(filters).some(Boolean);

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
        <CardSearch basePath="browse" />
      </div>

      <ActiveFilters basePath="browse" />

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
