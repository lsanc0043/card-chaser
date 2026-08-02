"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Offer = {
  id: string;
  createdAt: Date;
  status: string | null;
  price: string | null;
  condition: string | null;
  chaseRequest: {
    id: string;
    wishlistItem: {
      card: {
        id: string;
        name: string;
        attributes: {
          Rarity?: string;
        };
        set: {
          name: string;
        } | null;
        image: {
          small: string | null;
        } | null;
      };
      user: {
        displayName?: string | null;
      };
    };
    price: string | null;
    minPrice: string | null;
    maxPrice: string | null;
    useRange: boolean;
    conditions: string[];
    quantity: number;
  };
};

export default function OffersTable({ offers }: { offers: Offer[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <th style={headerStyle}>Card</th>
            <th style={headerStyle}>Requester</th>
            <th style={headerStyle}>Price</th>
            <th style={headerStyle}>Conditions</th>
            <th style={headerStyle}>Quantity</th>
            <th style={headerStyle}>Posted</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}></th>
          </tr>
        </thead>

        <tbody>
          {offers.map((offer) => {
            console.log(offer);
            const request = offer.chaseRequest;
            const card = request.wishlistItem.card;
            const attributes = card.attributes as Record<string, string>;

            return (
              <tr
                key={offer.id}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={cellStyle}>
                  <Link
                    href={`/cards/${card.id}`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textDecoration: hovered ? "underline" : "none",
                      textUnderlineOffset: "3px",
                      color: hovered ? "#2563eb" : "inherit",
                      borderRadius: "8px",
                      padding: "6px",
                      margin: "-6px",
                      transition:
                        "background-color 150ms ease, color 150ms ease",
                      backgroundColor: hovered ? "#f3f4f6" : "transparent",
                    }}
                  >
                    {card.image?.small && (
                      <Image
                        src={card.image.small}
                        alt={card.name}
                        width={50}
                        height={70}
                        style={{
                          borderRadius: "6px",
                          transition: "transform 150ms ease",
                          transform: hovered ? "scale(1.05)" : "scale(1)",
                        }}
                      />
                    )}

                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {card.name}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                        }}
                      >
                        {card.set?.name} |{attributes.Rarity}
                      </div>
                    </div>
                  </Link>
                </td>

                <td style={cellStyle}>
                  {request.wishlistItem.user.displayName}
                </td>

                <td
                  style={{
                    ...cellStyle,
                    fontWeight: 600,
                  }}
                >
                  <div>
                    <span style={{ color: "#6b7280" }}>Requested: </span>
                    {request?.useRange
                      ? `$${request.minPrice} - $${request.maxPrice}`
                      : `$${request.price}`}
                  </div>
                  <div style={{ color: "#2563eb" }}>
                    <span style={{ color: "#6b7280" }}>Offered: </span>
                    {"$" + offer.price}
                  </div>
                </td>

                <td
                  style={{
                    ...cellStyle,
                    fontWeight: 600,
                  }}
                >
                  <div>
                    <span style={{ color: "#6b7280" }}>Requested: </span>
                    {request.conditions.join(", ")}
                  </div>
                  <div style={{ color: "#2563eb" }}>
                    <span style={{ color: "#6b7280" }}>Offered: </span>
                    {offer.condition}
                  </div>
                </td>

                <td style={cellStyle}>{request?.quantity}</td>

                <td style={cellStyle}>
                  {new Date(offer.createdAt).toLocaleDateString()}
                </td>

                <td style={cellStyle}>{offer.status}</td>

                <td style={cellStyle}>
                  <Link
                    href={`/marketplace/${request.id}`}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {"Edit Offer"}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle = {
  textAlign: "left" as const,
  padding: "14px",
  fontSize: "14px",
  fontWeight: 700,
};

const cellStyle = {
  padding: "14px",
  fontSize: "14px",
};
