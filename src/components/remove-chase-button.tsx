"use client";

import { removeFromChase } from "@/app/actions/chase";

export default function RemoveChaseButton({
  chaseItemId,
}: {
  chaseItemId: string;
}) {
  async function handleRemove() {
    await removeFromChase(chaseItemId);
    window.location.reload();
  }

  return (
    <button
      onClick={handleRemove}
      className="border border-red-500 text-red-500 px-4 py-2 rounded"
    >
      Remove from Chase List
    </button>
  );
}
