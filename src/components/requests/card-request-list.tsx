"use client";

import { useState } from "react";
import Link from "next/link";
import RequestEditModal from "./request-edit-modal";
import { SerializedUserChaseRequest } from "@/lib/types";
import { formatConditions } from "@/lib/utils";

export default function RequestList({
  cardId,
  requests,
}: {
  cardId: string;
  requests: SerializedUserChaseRequest[];
}) {
  const [editingRequest, setEditingRequest] =
    useState<SerializedUserChaseRequest | null>(null);

  const [creating, setCreating] = useState(false);

  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          Chase Requests
        </h2>

        <button
          className="transition-shadow hover:shadow-lg hover:ring-2 hover:ring-blue-500"
          style={{
            border: "1px solid #2563eb",
            padding: "8px 14px",
            borderRadius: "0.75rem",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => setCreating(true)}
        >
          + Create Request
        </button>
      </div>

      {requests.length === 0 ? (
        <p
          style={{
            color: "#6b7280",
          }}
        >
          No chase requests found.
        </p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "15px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Price</th>
              <th style={headerStyle}>Conditions</th>
              <th style={headerStyle}>Quantity</th>
              <th style={headerStyle}>Offers</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => {
              const isHovered = hovered === request.id;

              return (
                <tr
                  key={request.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
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
                  <td
                    style={{
                      ...cellStyle,
                      fontWeight: 600,
                    }}
                  >
                    {request.useRange
                      ? `$${request.minPrice} - $${request.maxPrice}`
                      : `$${request.price}`}
                  </td>

                  <td style={cellStyle}>
                    {formatConditions(request.conditions)}
                  </td>

                  <td style={cellStyle}>{request.quantity}</td>

                  <td style={cellStyle}>
                    <Link
                      href={`/requests/${request.id}`}
                      style={{
                        color: "#2563eb",
                        textDecoration: isHovered ? "underline" : "none",
                      }}
                      onMouseEnter={() => setHovered(request.id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {request.offers.length} offer
                      {request.offers.length !== 1 ? "s" : ""}
                    </Link>
                  </td>

                  <td style={cellStyle}>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                      }}
                    >
                      <button onClick={() => setEditingRequest(request)}>
                        Edit
                      </button>

                      <button>Archive</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {(editingRequest || creating) && (
        <RequestEditModal
          cardId={cardId}
          mode={editingRequest ? "edit" : "create"}
          requestId={editingRequest?.id}
          initialValues={
            editingRequest
              ? {
                  price: editingRequest.price?.toString() ?? "",
                  useRange: editingRequest.useRange,
                  minPrice: editingRequest.minPrice?.toString() ?? "",
                  maxPrice: editingRequest.maxPrice?.toString() ?? "",
                  conditions: editingRequest.conditions,
                  quantity: editingRequest.quantity,
                }
              : undefined
          }
          onClose={() => {
            setEditingRequest(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

const headerStyle = {
  textAlign: "left" as const,
  padding: "14px",
  fontWeight: 700,
};

const cellStyle = {
  padding: "14px",
};
