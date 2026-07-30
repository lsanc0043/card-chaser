"use client";

import { useState } from "react";
import AuthRequiredModal from "@/components/auth-required-modal";
import Link from "next/link";

export default function ChaseToggleButton({
  userId,
  cardId,
  chaseItemId,
  removeAction,
}: {
  userId: string | null;
  cardId: string;
  chaseItemId?: string;
  removeAction: () => Promise<void>;
}) {
  const [showModal, setShowModal] = useState(false);

  const isInChase = !!chaseItemId;

  if (!userId) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          style={{
            marginTop: "24px",
            border: "1px solid #2563eb",
            padding: "10px 18px",
            borderRadius: "0.75rem",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add to Chase List
        </button>

        {showModal && (
          <AuthRequiredModal
            redirectUrl={`/cards/${cardId}`}
            description="You must be signed in to manage your chase list."
          />
        )}
      </>
    );
  }

  if (isInChase) {
    return (
      <form action={removeAction}>
        <button
          className="transition-shadow hover:shadow-lg hover:ring-2 hover:ring-red-500"
          style={{
            border: "1px solid #dc2626",
            padding: "10px 18px",
            borderRadius: "0.75rem",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Remove from Chase List
        </button>
      </form>
    );
  }

  return (
    <Link
      href={`/cards/${cardId}/request`}
      className="transition-shadow hover:shadow-lg hover:ring-2 hover:ring-blue-500"
      style={{
        display: "inline-block",
        border: "1px solid #2563eb",
        padding: "10px 18px",
        borderRadius: "0.75rem",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: 600,
        textDecoration: "none",
      }}
    >
      Add to Chase List
    </Link>
  );
}
