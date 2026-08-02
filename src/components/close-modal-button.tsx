"use client";

import { useModalClose } from "./modal-wrapper";

export default function CloseModalButton({
  onClose,
}: {
  onClose?: () => void;
}) {
  const closeModal = useModalClose();

  return (
    <button
      onClick={onClose ?? closeModal}
      style={{
        position: "absolute",
        top: "8px",
        right: "16px",
        border: "none",
        background: "transparent",
        fontSize: "24px",
        cursor: "pointer",
      }}
    >
      ×
    </button>
  );
}
