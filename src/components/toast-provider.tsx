"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Toast = {
  message: string;
  type?: "success" | "error";
};

const ToastContext = createContext<{
  showToast: (toast: Toast) => void;
} | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(newToast: Toast) {
    setToast(newToast);

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: toast.type === "error" ? "#dc2626" : "#16a34a",
            color: "white",
            padding: "12px 18px",
            borderRadius: "12px",
            fontWeight: 600,
            boxShadow: "0 10px 30px rgba(0,0,0,.15)",
            zIndex: 9999,
          }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
