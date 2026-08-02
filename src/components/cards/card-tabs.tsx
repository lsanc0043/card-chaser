"use client";

import { useState } from "react";

type Tab = "request" | "details" | "market";

export default function CardModalTabs({
  image,
  details,
  market,
  editRequest,
  showRequest,
}: {
  image: React.ReactNode;
  details: React.ReactNode;
  market: React.ReactNode;
  editRequest: React.ReactNode;
  showRequest: boolean;
}) {
  const tabs: {
    id: Tab;
    label: string;
  }[] = [
    ...(showRequest
      ? [
          {
            id: "request" as Tab,
            label: "Request",
          },
        ]
      : []),
    {
      id: "details",
      label: "Details",
    },
    {
      id: "market",
      label: "Market",
    },
  ];

  const [activeTab, setActiveTab] = useState<Tab>(
    showRequest ? "request" : "details",
  );

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div>
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600,
                color: activeTab === tab.id ? "#111827" : "#6b7280",
              }}
            >
              {tab.label}
            </button>
          ))}

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: `${(activeIndex * 100) / tabs.length}%`,
              width: `${100 / tabs.length}%`,
              height: "2px",
              backgroundColor: "#111827",
              borderRadius: "999px",
              transition: "left 250ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

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
          {activeTab === "request" && editRequest}

          {activeTab === "details" && details}

          {activeTab === "market" && market}
        </div>
      </div>
    </div>
  );
}
