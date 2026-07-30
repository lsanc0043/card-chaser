"use client";

import { useState } from "react";

export default function CardModalTabs({
  image,
  details,
  editRequest,
  showTabs,
}: {
  image: React.ReactNode;
  details: React.ReactNode;
  editRequest: React.ReactNode;
  showTabs: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "edit">("edit");

  return (
    <div>
      {showTabs && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            backgroundColor: "white",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <button
              onClick={() => setActiveTab("edit")}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600,
                color: activeTab === "edit" ? "#111827" : "#6b7280",
                transition: "color 200ms ease",
              }}
            >
              Edit Request
            </button>

            <button
              onClick={() => setActiveTab("details")}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600,
                color: activeTab === "details" ? "#111827" : "#6b7280",
                transition: "color 200ms ease",
              }}
            >
              Details
            </button>

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: activeTab === "edit" ? "0%" : "50%",
                width: "50%",
                height: "2px",
                backgroundColor: "#111827",
                borderRadius: "999px",
                transition: "left 250ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            position: "sticky",
            top: "60px",
            height: "fit-content",
          }}
        >
          {image}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {showTabs && activeTab === "edit" ? editRequest : details}
        </div>
      </div>
    </div>
  );
}
