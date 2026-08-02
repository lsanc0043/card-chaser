"use client";

import Image from "next/image";
import Link from "next/link";

type WishlistCardProps = {
  item: {
    id: string;
    status: string;
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
    };
    chaseRequest: {
      id: string;
      price: string | null;
      minPrice: string | null;
      maxPrice: string | null;
      useRange: boolean;
      conditions: string[];
      quantity: number;

      offers: {
        id?: string | null;
      }[];
    } | null;
  };
};

export default function WishlistCard({ item }: WishlistCardProps) {
  const request = item.chaseRequest;

  const statusStyles = request
    ? {
        label: "Request Open",
        background: "#ecfdf5",
        color: "#059669",
      }
    : {
        label: "Watching",
        background: "#f3f4f6",
        color: "#6b7280",
      };

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
            {item.card.set.name} · {item.card.tcg.name}
          </p>
        </div>

        <div
          style={{
            display: "inline-flex",
            width: "fit-content",
            background: statusStyles.background,
            color: statusStyles.color,
            borderRadius: "999px",
            padding: "4px 10px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {statusStyles.label}
        </div>

        {request && (
          <div
            style={{
              fontSize: "14px",
              color: "#374151",
            }}
          >
            <Link
              href={`/requests/${request.id}`}
              style={{
                display: "block",
                background: "#fff7ed",
                borderRadius: "10px",
                padding: "10px",
                color: "#c2410c",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {request.offers.length} offer
              {request.offers.length !== 1 && "s"} received →
            </Link>

            <div
              style={{
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "12px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>Want:</strong> {request.quantity}{" "}
                {request.quantity === 1 ? "copy" : "copies"}
              </p>

              <p>
                <strong>Condition:</strong>
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginTop: "6px",
                }}
              >
                {request.conditions.map((condition) => (
                  <span
                    key={condition}
                    style={{
                      background: "#eff6ff",
                      color: "#2563eb",
                      borderRadius: "999px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {condition}
                  </span>
                ))}
              </div>

              <p>
                <strong>Budget:</strong>{" "}
                {request.useRange
                  ? `$${request.minPrice} - $${request.maxPrice}`
                  : `$${request.price}`}
              </p>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: "8px",
            paddingTop: "12px",
          }}
        >
          {request ? (
            <>
              <Link
                href={`/wishlist/${item.id}/edit`}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#374151",
                }}
              >
                Edit
              </Link>
            </>
          ) : (
            <Link
              href={`/requests/create?wishlist=${item.id}`}
              style={{
                flex: 1,
                textAlign: "center",
                background: "#2563eb",
                color: "white",
                borderRadius: "8px",
                padding: "8px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create Request
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
