"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CardFiltersModal from "./card-filters-modal";

export default function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tcg = searchParams.get("tcg");
  const rarity = searchParams.get("rarity");
  const set = searchParams.get("set");

  const filters = [
    tcg && {
      label: tcg === "pokemon" ? "Pokémon" : "One Piece",
      key: "tcg",
    },
    rarity && {
      label: rarity,
      key: "rarity",
    },
    set && {
      label: set,
      key: "set",
    },
  ].filter(Boolean) as {
    label: string;
    key: string;
  }[];

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key);

    const query = params.toString();

    router.push(query ? `/browse?${query}` : "/browse");
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("tcg");
    params.delete("rarity");
    params.delete("set");

    const query = params.toString();

    router.push(query ? `/browse?${query}` : "/browse");
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
        minHeight: "42px",
        marginBottom: "8px",
      }}
    >
      <span
        style={{
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        Filters:
      </span>

      <CardFiltersModal />

      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => removeFilter(filter.key)}
          className="hover:bg-blue-100 transition-colors"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "999px",
            border: "1px solid #2563eb",
            background: "#eff6ff",
            color: "#2563eb",
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {filter.label}
          <span>×</span>
        </button>
      ))}

      {filters.length > 0 && (
        <button
          onClick={clearFilters}
          className="hover:bg-gray-100 transition-colors"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
