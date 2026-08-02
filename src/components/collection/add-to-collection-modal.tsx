"use client";

import { useState } from "react";
import { addToCollection } from "@/actions/collection";
import ModalWrapper from "../modal-wrapper";

const CONDITIONS = [
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
];

export default function AddToCollectionModal({
  cardId,
  onClose,
}: {
  cardId: string;
  onClose: () => void;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(CONDITIONS.map((c) => [c, 0])),
  );

  async function save() {
    await addToCollection({
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
    <ModalWrapper>
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          width: "420px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          Add to Collection
        </h2>

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
    </ModalWrapper>
  );
}
