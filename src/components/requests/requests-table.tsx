"use client";

import { SerializedUserChaseRequest } from "@/lib/types";
import { formatConditions } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RequestsTable({
  requests,
}: {
  requests: SerializedUserChaseRequest[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);

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
            <th style={headerStyle}>Price</th>
            <th style={headerStyle}>Conditions</th>
            <th style={headerStyle}>Quantity</th>
            <th style={headerStyle}>Posted</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}></th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => {
            const isHovered = hovered === request.id;
            const attributes = request.wishlistItem.card.attributes as Record<
              string,
              string
            >;
            return (
              <tr
                key={request.id}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={cellStyle}>
                  <Link
                    href={`/cards/${request.wishlistItem.card.id}`}
                    onMouseEnter={() => setHovered(request.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textDecoration: isHovered ? "underline" : "none",
                      textUnderlineOffset: "3px",
                      color: isHovered ? "#2563eb" : "inherit",
                      borderRadius: "8px",
                      padding: "6px",
                      margin: "-6px",
                      transition:
                        "background-color 150ms ease, color 150ms ease",
                      backgroundColor: isHovered ? "#f3f4f6" : "transparent",
                    }}
                  >
                    {request.wishlistItem.card.image?.small && (
                      <Image
                        src={request.wishlistItem.card.image.small}
                        alt={request.wishlistItem.card.name}
                        width={50}
                        height={70}
                        style={{
                          borderRadius: "6px",
                          transition: "transform 150ms ease",
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                        }}
                      />
                    )}

                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {request.wishlistItem.card.name}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                        }}
                      >
                        {request.wishlistItem.card.set?.name} |{" "}
                        {attributes.Rarity}
                      </div>
                    </div>
                  </Link>
                </td>

                <td
                  style={{
                    ...cellStyle,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {request?.useRange
                    ? `$${request.minPrice} - $${request.maxPrice}`
                    : `$${request.price}`}
                </td>

                <td style={cellStyle}>
                  {formatConditions(request.conditions)}
                </td>

                <td style={cellStyle}>{request?.quantity}</td>

                <td style={cellStyle}>
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>

                <td style={cellStyle}>
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
                    {request.status}
                  </span>
                </td>

                <td style={cellStyle}>
                  {
                    <Link
                      href={`/requests/${request.id}`}
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
                      {`View Offers (${request.offers.length})`}
                    </Link>
                  }
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
