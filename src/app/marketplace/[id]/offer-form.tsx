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
    <div
      style={{
        marginTop: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          padding: "8px 12px",
          width: "100%",
          fontSize: "16px",
        }}
      />

      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          padding: "8px 12px",
          width: "100%",
          fontSize: "16px",
          backgroundColor: "white",
        }}
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
        className="hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          padding: "8px 16px",
          cursor: isValid ? "pointer" : "not-allowed",
          backgroundColor: "white",
          fontWeight: 500,
        }}
      >
        Submit Offer
      </button>
    </div>
  );
}
