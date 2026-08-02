"use client";

import Link from "next/link";
import ModalWrapper, { useModalClose } from "./modal-wrapper";
import CloseModalButton from "./close-modal-button";

export default function AuthRequiredModal({
  redirectUrl,
  description = "You must be signed in to view this page.",
  onClose,
}: {
  redirectUrl: string;
  description?: string;
  onClose?: () => void;
}) {
  return (
    <ModalWrapper>
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
        <CloseModalButton onClose={onClose ?? useModalClose} />
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
    </ModalWrapper>
  );
}
