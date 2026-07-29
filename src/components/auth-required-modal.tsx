"use client";

import Link from "next/link";

export default function AuthRequiredModal({
  redirectUrl,
  description = "You must be signed in to view this page.",
}: {
  redirectUrl: string;
  description?: string;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "16px",
          textAlign: "center",
          width: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Sign in required
        </h2>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "24px",
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              backgroundColor: "#111827",
              color: "white",
            }}
          >
            Sign In
          </Link>

          <Link
            href={`/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
