"use client";

import { useRouter } from "next/navigation";

export default function ViewRequestsButton({
  cardId,
  total,
}: {
  cardId: string;
  total: number;
}) {
  const router = useRouter();

  if (total === 0) {
    return <span>None</span>;
  }

  function handleClick() {
    router.back();

    setTimeout(() => {
      router.push(`/cards/${cardId}/requests`);
    }, 100);
  }

  return (
    <button
      onClick={handleClick}
      style={{
        color: "#2563eb",
        cursor: "pointer",
        background: "none",
        border: "none",
      }}
    >
      View Requests ({total})
    </button>
  );
}
