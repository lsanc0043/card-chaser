"use client";

import { useState } from "react";
import AuthRequiredModal from "@/components/auth-required-modal";

export default function AddToChaseButton({
  userId,
  cardId,
  action,
}: {
  userId: string | null;
  cardId: string;
  action: () => Promise<void>;
}) {
  const [showModal, setShowModal] = useState(false);

  if (!userId) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          style={{
            marginTop: "24px",
            border: "1px solid #d1d5db",
            padding: "8px 16px",
            borderRadius: "6px",
            backgroundColor: "white",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Add to Chase List
        </button>

        {showModal && (
          <AuthRequiredModal
            redirectUrl={`/cards/${cardId}`}
            description="You must be signed in to add this card to your chase list."
          />
        )}
      </>
    );
  }

  return (
    <form action={action}>
      <button
        style={{
          marginTop: "24px",
          border: "1px solid #d1d5db",
          padding: "8px 16px",
          borderRadius: "6px",
          backgroundColor: "white",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Add to Chase List
      </button>
    </form>
  );
}
