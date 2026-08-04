import { CardWithDetails } from "@/lib/types";

export default function CardHeader({ card }: { card: CardWithDetails }) {
  const attributes = card.attributes as Record<string, string>;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 700,
          margin: 0,
        }}
      >
        {card.name}
      </h1>

      {card.set?.name && (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {card.set?.name}
        </span>
      )}

      {attributes.Rarity && (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {attributes.Rarity}
        </span>
      )}
    </div>
  );
}
