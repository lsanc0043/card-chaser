"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CardFiltersModal from "./card-filters-modal";

export default function ActiveFilters({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tcgs = searchParams.get("tcg")?.split(",") ?? [];
  const rarities = searchParams.get("rarity")?.split(",") ?? [];
  const sets = searchParams.get("set")?.split(",") ?? [];

  const filters = [
    ...tcgs.map((value) => ({
      label: value === "pokemon" ? "Pokémon" : "One Piece",
      key: "tcg",
      value,
    })),

    ...rarities.map((value) => ({
      label: value,
      key: "rarity",
      value,
    })),

    ...sets.map((value) => ({
      label: value,
      key: "set",
      value,
    })),
  ];

  function removeFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    const values = params.get(key)?.split(",") ?? [];

    const updated = values.filter((item) => item !== value);

    if (updated.length > 0) {
      params.set(key, updated.join(","));
    } else {
      params.delete(key);
    }

    const query = params.toString();

    router.push(query ? `/${basePath}?${query}` : `/${basePath}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("tcg");
    params.delete("rarity");
    params.delete("set");

    const query = params.toString();

    router.push(query ? `/${basePath}?${query}` : `/${basePath}`);
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

      <CardFiltersModal basePath={basePath} />

      {filters.map((filter) => (
        <button
          key={`${filter.key}-${filter.value}`}
          onClick={() => removeFilter(filter.key, filter.value)}
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
