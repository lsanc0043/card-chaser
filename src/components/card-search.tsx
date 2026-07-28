"use client";

import { useState } from "react";
import Link from "next/link";

type Card = {
  id: string;
  name: string;
  setName: string;
  rarity: string | null;
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

    setResults(data);
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search cards..."
        className="border rounded px-4 py-2 w-full"
      />

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 z-10">
          {results.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="block p-3 hover:bg-gray-100"
              onClick={() => {
                setResults([]);
                setQuery("");
              }}
            >
              <div className="font-semibold">{card.name}</div>

              <div className="text-sm text-gray-500">
                {card.setName} · {card.rarity}
              </div>
            </Link>
          ))}

          <Link
            href={`/search?q=${query}`}
            className="block p-3 border-t font-semibold hover:bg-gray-100"
            onClick={() => {
              setResults([]);
              setQuery("");
            }}
          >
            {`View all results for ${query}`}
          </Link>
        </div>
      )}
    </div>
  );
}
