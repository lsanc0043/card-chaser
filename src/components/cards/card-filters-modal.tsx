"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const tcgOptions = [
  {
    label: "Pokémon",
    value: "pokemon",
  },
  {
    label: "One Piece",
    value: "one-piece",
  },
];

const rarityOptionsByTcg: Record<string, string[]> = {
  pokemon: [
    "Common",
    "Uncommon",
    "Rare",
    "Holo Rare",
    "Ultra Rare",
    "Secret Rare",
  ],
  "one-piece": ["C", "UC", "R", "SR", "SEC", "L"],
};

export default function CardFiltersModal({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const [tcgs, setTcgs] = useState(searchParams.get("tcg")?.split(",") ?? []);

  const [rarities, setRarities] = useState(
    searchParams.get("rarity")?.split(",") ?? [],
  );

  const rarityOptions = [
    ...new Set(tcgs.flatMap((tcg) => rarityOptionsByTcg[tcg] ?? [])),
  ];

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (tcgs.length > 0) {
      params.set("tcg", tcgs.join(","));
    } else {
      params.delete("tcg");
    }

    if (rarities.length > 0) {
      params.set("rarity", rarities.join(","));
    } else {
      params.delete("rarity");
    }

    router.push(`/${basePath}?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    setTcgs([]);
    setRarities([]);

    const params = new URLSearchParams(searchParams.toString());

    params.delete("tcg");
    params.delete("rarity");
    params.delete("set");

    const queryString = params.toString();

    router.push(queryString ? `/${basePath}?${queryString}` : `/${basePath}`);

    setOpen(false);
  }

  function toggleArrayFilter(
    current: string[],
    value: string,
    setter: (value: string[]) => void,
  ) {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setTcgs(searchParams.get("tcg")?.split(",") ?? []);
          setRarities(searchParams.get("rarity")?.split(",") ?? []);
          setOpen(true);
        }}
        className="hover:bg-gray-100 transition-colors"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          borderRadius: "999px",
          border: "1px dashed #9ca3af",
          background: "white",
          color: "#374151",
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        <span>+</span>
        Add Filters
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "16px",
              width: "460px",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "24px",
              }}
            >
              Filter Cards
            </h2>

            {/* TCG */}
            <section>
              <p
                style={{
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                Trading Card Game
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {tcgOptions.map((option) => {
                  const selected = tcgs.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        toggleArrayFilter(tcgs, option.value, setTcgs)
                      }
                      className="hover:bg-gray-100 transition-colors"
                      style={{
                        padding: "8px 14px",
                        borderRadius: "999px",
                        border: selected
                          ? "1px solid #2563eb"
                          : "1px solid #d1d5db",
                        background: selected ? "#eff6ff" : "white",
                        color: selected ? "#2563eb" : "#374151",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <hr
              style={{
                margin: "24px 0",
                border: "none",
                borderTop: "1px solid #e5e7eb",
              }}
            />

            {/* Rarity */}
            <section
              style={{
                marginTop: "20px",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Rarity
              </p>

              {!tcgs.length ? (
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Select a TCG first
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {rarityOptions.map((option) => {
                    const selected = rarities.includes(option);

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          toggleArrayFilter(rarities, option, setRarities)
                        }
                        className="hover:bg-gray-100 transition-colors"
                        style={{
                          padding: "8px 12px",
                          borderRadius: "999px",
                          border: selected
                            ? "1px solid #2563eb"
                            : "1px solid #d1d5db",
                          background: selected ? "#eff6ff" : "white",
                          color: selected ? "#2563eb" : "#111827",
                          cursor: "pointer",
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "32px",
              }}
            >
              <button
                onClick={clearFilters}
                className="hover:bg-gray-100 transition-colors"
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Clear Filters
              </button>

              <button
                onClick={applyFilters}
                className="hover:bg-blue-700 transition-colors"
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
