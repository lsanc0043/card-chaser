"use client";

import { cardConditions } from "@/constants/cardConditions";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function OfferForm({
  chaseRequestId,
  minPrice,
  maxPrice,
  allowedConditions,
  initialOffer,
}: {
  chaseRequestId: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  allowedConditions: string[];
  initialOffer?: {
    price: string;
    condition: string;
    message?: string | null;
  };
}) {
  const router = useRouter();
  const [price, setPrice] = useState(initialOffer?.price ?? "");
  const [condition, setCondition] = useState(initialOffer?.condition ?? "");
  const [message, setMessage] = useState(initialOffer?.message ?? "");
  const [loading, setLoading] = useState(false);

  const numericPrice = Number(price);

  const isPriceValid =
    price.trim() !== "" &&
    !isNaN(numericPrice) &&
    numericPrice > 0 &&
    (minPrice == null || maxPrice == null
      ? true
      : numericPrice >= minPrice && numericPrice <= maxPrice);

  const isValid = isPriceValid && condition !== "";

  async function submitOffer() {
    if (!isValid || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chaseRequestId,
          price: numericPrice,
          condition,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit offer");
      }

      router.back();
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong submitting offer",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        marginTop: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div>
        <p style={{ fontWeight: 600 }}>Offer Price</p>

        <input
          type="number"
          step={0.01}
          min={minPrice ?? 0.01}
          max={maxPrice ?? undefined}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
          placeholder={
            minPrice != null && maxPrice != null
              ? `$${minPrice} - $${maxPrice}`
              : "$0.00"
          }
        />

        {!isPriceValid && price !== "" && (
          <p
            style={{
              color: "#dc2626",
              fontSize: "14px",
              marginTop: "6px",
            }}
          >
            {minPrice != null && maxPrice != null
              ? `Offer must be between $${minPrice} and $${maxPrice}`
              : "Enter a valid price"}
          </p>
        )}
      </div>

      <div>
        <p style={{ fontWeight: 600 }}>Condition</p>

        <ConditionDropdown
          value={condition}
          onChange={setCondition}
          allowedConditions={allowedConditions}
        />
      </div>

      <div>
        <p style={{ fontWeight: 600 }}>Message (Optional)</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a note to the buyer..."
          maxLength={500}
          style={{
            width: "100%",
            minHeight: "100px",
            marginTop: "6px",
            padding: "10px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            resize: "vertical",
            fontSize: "16px",
            fontFamily: "inherit",
          }}
        />

        <p
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "4px",
          }}
        >
          {message?.length}/500
        </p>
      </div>

      <button
        onClick={submitOffer}
        disabled={!isValid || loading}
        className="hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          padding: "8px",
          cursor: isValid ? "pointer" : "not-allowed",
          backgroundColor: "white",
          fontWeight: 500,
        }}
      >
        {loading
          ? initialOffer
            ? "Updating..."
            : "Submitting..."
          : initialOffer
            ? "Update Offer"
            : "Submit Offer"}
      </button>
    </div>
  );
}

function ConditionDropdown({
  value,
  onChange,
  allowedConditions,
}: {
  value: string;
  onChange: (value: string) => void;
  allowedConditions: string[];
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggleDropdown() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }

    setOpen(!open);
  }

  const selected =
    cardConditions.find((c) => c.label === value)?.label ?? "Select condition";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        style={{
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "10px",
          fontSize: "16px",
          backgroundColor: "white",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        {selected}
      </button>

      {open &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: position.width,
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 9999,
              overflow: "hidden",
            }}
          >
            {cardConditions.map((condition) => {
              const disabled = !allowedConditions.includes(condition.label);

              return (
                <button
                  key={condition.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      onChange(condition.label);
                      setOpen(false);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!disabled) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    background: "white",
                    textAlign: "left",
                    cursor: disabled ? "not-allowed" : "pointer",
                    color: disabled ? "#9ca3af" : "#111827",
                  }}
                >
                  {condition.label}
                  {disabled && " (Not requested)"}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};
