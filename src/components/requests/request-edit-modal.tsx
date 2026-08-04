"use client";

import NestedModalWrapper from "../modals/nested-modal-wrapper";
import RequestForm from "./request-form";

export default function RequestEditModal({
  cardId,
  requestId,
  initialValues,
  mode,
  onClose,
}: {
  cardId: string;
  requestId?: string;
  mode: "create" | "edit";
  initialValues?: {
    price?: string;
    useRange: boolean;
    minPrice?: string;
    maxPrice?: string;
    conditions: string[];
    quantity: number;
  };
  onClose: () => void;
}) {
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
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {mode === "edit" ? "Edit Chase Request" : "Create Chase Request"}
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <RequestForm
          cardId={cardId}
          requestId={requestId}
          mode={mode}
          initialValues={initialValues}
          onSuccess={onClose}
        />
      </div>
    </NestedModalWrapper>
  );
}
