"use client";

import { useState } from "react";
import { createChaseRequest, updateChaseRequest } from "@/actions/chase";
import { useRouter } from "next/navigation";
import { cardConditions } from "@/constants/cardConditions";

type RequestFormProps = {
  cardId: string;
  requestId?: string;
  mode: "create" | "edit";

  initialValues?: {
    price?: string;
    useRange: boolean;
    minPrice?: string;
    maxPrice?: string;
    conditions: string[];
    quantity: number;
  };
};

export default function RequestForm({
  cardId,
  requestId,
  mode,
  initialValues,
}: RequestFormProps) {
  const router = useRouter();

  const [price, setPrice] = useState(initialValues?.price ?? "");
  const [useRange, setUseRange] = useState(initialValues?.useRange ?? false);
  const [minPrice, setMinPrice] = useState(initialValues?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialValues?.maxPrice ?? "");
  const [selectedConditions, setSelectedConditions] = useState(
    initialValues?.conditions ?? [],
  );
  const [quantity, setQuantity] = useState(initialValues?.quantity ?? 1);
  const [errors, setErrors] = useState<string[]>([]);

  function toggleCondition(condition: string) {
    setSelectedConditions((current) =>
      current.includes(condition)
        ? current.filter((item) => item !== condition)
        : [...current, condition],
    );
  }

  async function handleSubmit() {
    const newErrors: string[] = [];

    if (useRange) {
      if (!minPrice) {
        newErrors.push("Minimum price is required.");
      }

      if (!maxPrice) {
        newErrors.push("Maximum price is required.");
      }

      if (minPrice && maxPrice && Number(maxPrice) < Number(minPrice)) {
        newErrors.push("Maximum price cannot be lower than minimum price.");
      }
    } else {
      if (!price) {
        newErrors.push("Price is required.");
      }
    }

    if (selectedConditions.length === 0) {
      newErrors.push("Select at least one acceptable condition.");
    }

    if (quantity < 1) {
      newErrors.push("Quantity must be at least 1.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    try {
      if (mode === "create") {
        await createChaseRequest({
          cardId,
          price: useRange ? null : Number(price),
          useRange,
          minPrice: useRange ? Number(minPrice) : null,
          maxPrice: useRange ? Number(maxPrice) : null,
          conditions: selectedConditions,
          quantity,
        });
      } else {
        if (requestId) {
          await updateChaseRequest({
            requestId: requestId,
            price: useRange ? null : Number(price),
            useRange,
            minPrice: useRange ? Number(minPrice) : null,
            maxPrice: useRange ? Number(maxPrice) : null,
            conditions: selectedConditions,
            quantity,
          });
        }
      }

      router.refresh();
      router.back();
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Something went wrong",
      ]);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {useRange ? (
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          <div>
            <p style={{ fontWeight: 600 }}>Minimum</p>

            <input
              type="number"
              step={0.01}
              min={0.01}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={inputStyle}
              placeholder="$0.00"
            />
          </div>

          <div>
            <p style={{ fontWeight: 600 }}>Maximum</p>

            <input
              type="number"
              step={0.01}
              min={minPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={inputStyle}
              placeholder="$0.00"
            />
          </div>
        </div>
      ) : (
        <div>
          <p style={{ fontWeight: 600 }}>Price</p>

          <input
            type="number"
            step={0.01}
            min={0.01}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
            placeholder="$0.00"
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <input
          type="checkbox"
          checked={useRange}
          onChange={(e) => {
            const checked = e.target.checked;
            setUseRange(checked);

            if (checked) {
              setMinPrice(price);
              setMaxPrice(price);
            } else {
              setMinPrice("");
              setMaxPrice("");
            }
          }}
        />

        <label>Allow price range</label>
      </div>

      <div>
        <p style={{ fontWeight: 600 }}>Acceptable Conditions</p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {cardConditions.map((condition) => (
            <label
              key={condition.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={selectedConditions.includes(condition.label)}
                onChange={() => toggleCondition(condition.label)}
              />

              {condition.label}
            </label>
          ))}
        </div>
      </div>

      <label>
        Quantity
        <input
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={inputStyle}
        />
      </label>

      {errors.length > 0 && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            border: "1px solid #ef4444",
            color: "#b91c1c",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <ul style={{ margin: 0 }}>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "12px",
          padding: "12px",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          fontWeight: 600,
        }}
      >
        {`${mode === "edit" ? "Edit" : "Create"} Request`}
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};
