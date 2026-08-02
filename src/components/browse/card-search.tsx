"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

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

export default function CardSearch({ basePath }: { basePath: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        params.set("q", query);

        const currentParams = new URLSearchParams(window.location.search);

        for (const [key, value] of currentParams.entries()) {
          if (key !== "q") {
            params.set(key, value);
          }
        }

        const response = await fetch(`/api/cards/browse?${params.toString()}`);

        const data = await response.json();

        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "500px",
      }}
      ref={searchRef}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        <Search
          size={18}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
          }}
        />

        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value;

            setQuery(value);

            if (!value.trim()) {
              setResults([]);
            }
          }}
          placeholder="Search cards..."
          style={{
            width: "100%",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "10px 16px 10px 40px",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </div>

      {(loading || results.length > 0) && (
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
          {loading && <div className="block p-3">Searching...</div>}

          {!loading &&
            results.map((card) => (
              <div key={card.id}>
                <Link
                  href={`/cards/${card.id}`}
                  className="block p-3 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setResults([]);
                    setQuery("");
                  }}
                >
                  <div className="font-semibold">{card.name}</div>

                  <div className="text-sm text-gray-500">
                    {card.set?.name} · {card.attributes.rarity}
                  </div>
                </Link>
                <Link
                  href={`/${basePath}?${(() => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("q", query);
                    return params.toString();
                  })()}`}
                  className="block p-3 border-t font-semibold hover:bg-gray-100 transition-colors"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  onClick={() => {
                    setResults([]);
                    setLoading(false);
                  }}
                >
                  {`View all results for "${query}"`}
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
