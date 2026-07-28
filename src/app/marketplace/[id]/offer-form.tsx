"use client";

import { cardConditions } from "@/constants/cardConditions";
import { useState } from "react";

export default function OfferForm({ chaseItemId }: { chaseItemId: string }) {
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const isValid = price.trim() !== "" && condition !== "";

  async function submitOffer() {
    if (!price || !condition) {
      alert("Please enter a price and select a condition.");
      return;
    }

    await fetch("/api/offers", {
      method: "POST",
      body: JSON.stringify({
        chaseItemId,
        price,
        condition,
      }),
    });

    alert("Offer submitted!");
  }

  return (
    <div className="mt-6 space-y-4">
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select condition</option>

        {cardConditions.map((condition) => (
          <option key={condition.value} value={condition.value}>
            {condition.label}
          </option>
        ))}
      </select>

      <button
        onClick={submitOffer}
        disabled={!isValid}
        className="border px-4 py-2 rounded"
      >
        Submit Offer
      </button>
    </div>
  );
}
