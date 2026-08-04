"use client";

import { openFullPage } from "@/lib/utils";

export default function CardPageViewButton({ cardId }: { cardId: string }) {
  return (
    <button
      onClick={() => openFullPage(`/cards/${cardId}`)}
      style={{
        color: "#2563eb",
      }}
    >
      Back to Card
    </button>
  );
}
