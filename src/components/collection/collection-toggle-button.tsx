"use client";

import { useState } from "react";
import AddToCollectionModal from "./add-to-collection-modal";

export default function CollectionToggleButton({
  cardId,
  collectionItemId,
  removeAction,
}: {
  cardId: string;
  collectionItemId?: string;
  removeAction: () => Promise<void>;
}) {
  const [showModal, setShowModal] = useState(false);
  const inCollection = !!collectionItemId;

  return inCollection ? (
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
        marginTop: "8px",
      }}
      onClick={removeAction}
    >
      Remove from Collection
    </button>
  ) : (
    <>
      <button
        className="transition-shadow hover:shadow-lg hover:ring-2 hover:ring-blue-500"
        style={{
          border: "1px solid #2563eb",
          padding: "10px 18px",
          borderRadius: "0.75rem",
          backgroundColor: "#2563eb",
          color: "white",
          cursor: "pointer",
          fontWeight: 600,
          marginTop: "8px",
        }}
        onClick={() => setShowModal(true)}
      >
        Add to Collection
      </button>
      {showModal && (
        <AddToCollectionModal
          cardId={cardId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
