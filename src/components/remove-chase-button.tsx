"use client";

import { removeFromChase } from "@/app/actions/chase";

export default function RemoveChaseButton({
  chaseItemId,
  cardId,
}: {
  chaseItemId: string;
  cardId: string;
}) {
  async function handleRemove() {
    await removeFromChase(chaseItemId, cardId);
    window.location.reload();
  }

  return (
    <button
      onClick={handleRemove}
      className="hover:bg-red-50 transition-colors"
      style={{
        border: "1px solid #ef4444",
        color: "#ef4444",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: "white",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      Remove from Chase List
    </button>
  );
}
