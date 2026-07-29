"use client";

import { ExternalLink } from "lucide-react";

export default function TcgplayerButton({ url }: { url?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        transition-all
        duration-200
        hover:shadow-lg
        active:scale-95
      "
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        borderRadius: "0.75rem",
        border: "1px solid #0B4F9C",
        background:
          "linear-gradient(90deg, #0B4F9C 0%, #0B4F9C 45%, #F58220 100%)",
        padding: "0.5rem 1rem",
        fontWeight: 600,
        color: "#FFFFFF",
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        textDecoration: "none",
      }}
    >
      <span>Open on TCGplayer</span>

      <span
        className="transition-transform group-hover:translate-x-0.5"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.18)",
          padding: "0.25rem",
        }}
      >
        <ExternalLink size={15} />
      </span>
    </a>
  );
}
