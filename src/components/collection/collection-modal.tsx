"use client";

import { useState } from "react";
import { saveCollection } from "@/actions/collection";
import { CONDITIONS } from "@/lib/cards/constants";
import NestedModalWrapper from "../modals/nested-modal-wrapper";

type CollectionModalProps = {
  cardId: string;
  onClose: () => void;
  initialQuantities?: Record<string, number>;
  mode?: "add" | "edit";
};

export default function CollectionModal({
  cardId,
  onClose,
  initialQuantities,
  mode = "add",
}: CollectionModalProps) {
  const defaultQuantities = Object.fromEntries(CONDITIONS.map((c) => [c, 0]));

  const [quantities, setQuantities] = useState<Record<string, number>>({
    ...defaultQuantities,
    ...initialQuantities,
  });

  async function save() {
    await saveCollection({
      cardId,
      quantities,
    });

    onClose();
  }

  function increment(condition: string) {
    setQuantities((prev) => ({
      ...prev,
      [condition]: prev[condition] + 1,
    }));
  }

  function decrement(condition: string) {
    setQuantities((prev) => ({
      ...prev,
      [condition]: Math.max(0, prev[condition] - 1),
    }));
  }

  return (
    <NestedModalWrapper onClose={onClose}>
      <div
        style={{
          backgroundColor: "white",
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            {mode === "edit" ? "Edit Collection" : "Add to Collection"}
          </h2>{" "}
          <button onClick={onClose}>✕</button>
        </div>

        {CONDITIONS.map((condition) => (
          <div
            key={condition}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span>{condition}</span>

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <button onClick={() => decrement(condition)}>-</button>

              <span
                style={{
                  width: "24px",
                  textAlign: "center",
                }}
              >
                {quantities[condition]}
              </span>

              <button onClick={() => increment(condition)}>+</button>
            </div>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 14px",
            }}
          >
            Cancel
          </button>

          <button
            onClick={save}
            style={{
              padding: "8px 14px",
              background: "#2563eb",
              color: "white",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </NestedModalWrapper>
  );
}
