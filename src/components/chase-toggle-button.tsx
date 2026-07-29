"use client";

import { useState } from "react";
import AuthRequiredModal from "@/components/auth-required-modal";

export default function ChaseToggleButton({
  userId,
  cardId,
  chaseItemId,
  addAction,
  removeAction,
}: {
  userId: string | null;
  cardId: string;
  chaseItemId?: string;
  addAction: () => Promise<void>;
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
            transition: "all 0.2s ease",
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

  return (
    <form action={isInChase ? removeAction : addAction}>
      <button
        className={
          isInChase
            ? "transition-shadow hover:shadow-lg hover:ring-2 hover:ring-red-500"
            : "transition-shadow hover:shadow-lg hover:ring-2 hover:ring-blue-500"
        }
        style={{
          border: isInChase ? "1px solid #dc2626" : "1px solid #2563eb",
          padding: "10px 18px",
          borderRadius: "0.75rem",
          backgroundColor: isInChase ? "#fee2e2" : "#2563eb",
          color: isInChase ? "#dc2626" : "white",
          cursor: "pointer",
          fontWeight: 600,
          transition: "all 0.2s ease",
        }}
      >
        {isInChase ? "Remove from Chase List" : "Add to Chase List"}
      </button>
    </form>
  );
}
