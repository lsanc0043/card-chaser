"use client";

import Image from "next/image";

type CollectionCardProps = {
  item: {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    cardId: string;
    quantity: number;
    locked: boolean;
    condition: string;
    purchasePrice: string | null;
    purchaseDate: Date | null;
    notes: string | null;
    card: {
      id: string;
      name: string;
      image: {
        medium: string | null;
      } | null;
      set: {
        name: string;
      };
      tcg: {
        name: string;
      };
      attributes: {
        Rarity: string | null;
      };
    };
  };
};

export default function CollectionCard({ item }: CollectionCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        overflow: "hidden",
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Card Image */}
      <div
        style={{
          height: "260px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          background: "#f9fafb",
        }}
      >
        <Image
          src={item.card.image?.medium ?? "/images/card-placeholder.svg"}
          alt={item.card.name}
          width={180}
          height={250}
          style={{
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 1,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            {item.card.name}
          </h3>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            {`${item.card.tcg.name} · ${item.card.set.name} ·
            ${item.card.attributes.Rarity}`}
          </p>
        </div>

        <div>
          <p
            style={{
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
            }}
          >
            {item.condition}
          </p>

          <p>
            Qty: <strong>{item.quantity}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
