"use client";

import { useState } from "react";
import CollectionModal from "./collection-modal";
import { UserCollectionItem } from "@/lib/types";

export default function EditCollectionButton({
  cardId,
  collectionItems,
}: {
  cardId: string;
  collectionItems: UserCollectionItem[];
}) {
  const [showModal, setShowModal] = useState(false);

  const initialQuantities = collectionItems?.reduce(
    (acc, item) => {
      acc[item.condition] = item.quantity;
      return acc;
    },
    {
      "Near Mint": 0,
      "Lightly Played": 0,
      "Moderately Played": 0,
      "Heavily Played": 0,
      Damaged: 0,
    } as Record<string, number>,
  );

  return (
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
        Edit Collection
      </button>

      {showModal && (
        <CollectionModal
          cardId={cardId}
          onClose={() => setShowModal(false)}
          initialQuantities={initialQuantities}
          mode="edit"
        />
      )}
    </>
  );
}
