"use client";

import { useState } from "react";
import Link from "next/link";

type Card = {
  id: string;
  name: string;
  set: {
    name: string;
  } | null;
  attributes: {
    rarity: string | null;
  };
};

export default function CardSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Card[]>([]);

  async function handleSearch(value: string) {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const response = await fetch(`/api/cards/search?q=${value}`);
    const data = await response.json();

    console.log("Search results:", data); // Log the search results for debugging
    setResults(data);
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "500px",
      }}
    >
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search cards..."
        style={{
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "16px",
          outline: "none",
        }}
      />

      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          {results.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="block p-3 hover:bg-gray-100 transition-colors"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
              onClick={() => {
                setResults([]);
                setQuery("");
              }}
            >
              <div className="font-semibold">{card.name}</div>

              <div className="text-sm text-gray-500">
                {card.set?.name || "Unknown Set"} ·{" "}
                {card.attributes?.rarity || "Unknown Rarity"}
              </div>
            </Link>
          ))}

          <Link
            href={`/search?q=${query}`}
            className="block p-3 border-t font-semibold hover:bg-gray-100 transition-colors"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
            onClick={() => {
              setResults([]);
              setQuery("");
            }}
          >
            {`View all results for "${query}"`}
          </Link>
        </div>
      )}
    </div>
  );
}
