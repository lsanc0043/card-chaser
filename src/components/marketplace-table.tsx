"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MarketplaceRequest = {
  id: string;
  status: string;
  createdAt: string;

  user: {
    displayName: string;
  };

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

  request: {
    id: string;
    price: string | null;
    minPrice: string | null;
    maxPrice: string | null;
    useRange: boolean;
    conditions: string[];
    quantity: number;

    offers: {
      id: string;
    }[];
  };
};

export default function MarketplaceTable({
  requests,
}: {
  requests: MarketplaceRequest[];
}) {
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
            <th style={headerStyle}></th>
          </tr>
        </thead>

        <tbody>
          {requests.map((item) => {
            const request = item.request;
            const hasOffer = request.offers.length > 0;
            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={cellStyle}>
                  <Link
                    href={`/cards/${item.card.id}`}
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
                    {item.card.image?.small && (
                      <Image
                        src={item.card.image.small}
                        alt={item.card.name}
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
                        {item.card.name}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                        }}
                      >
                        {item.card.set?.name} | {item.card.attributes.Rarity}
                      </div>
                    </div>
                  </Link>
                </td>

                <td style={cellStyle}>{item.user.displayName}</td>

                <td
                  style={{
                    ...cellStyle,
                    fontWeight: 600,
                  }}
                >
                  {request?.useRange
                    ? `$${request.minPrice} - $${request.maxPrice}`
                    : `$${request.price}`}
                </td>

                <td style={cellStyle}>{request?.conditions.join(", ")}</td>

                <td style={cellStyle}>{request?.quantity}</td>

                <td style={cellStyle}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

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
                    {hasOffer ? "Edit Offer" : "Make Offer"}
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
