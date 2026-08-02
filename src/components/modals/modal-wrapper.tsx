"use client";

import { useRouter } from "next/navigation";
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";

const ModalContext = createContext<{
  closeModal: () => void;
} | null>(null);

export function useModalClose() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModalClose must be inside ModalWrapper");
  }

  return context.closeModal;
}

export default function ModalWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  function closeModal() {
    setIsVisible(false);

    setTimeout(() => {
      router.back();
    }, 120);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  return (
    <ModalContext.Provider value={{ closeModal }}>
      <div
        onClick={handleOverlayClick}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          zIndex: 50,
          opacity: isVisible ? 1 : 0,
          transition: isVisible
            ? "opacity 80ms ease-out"
            : "opacity 200ms ease-in-out",
        }}
      >
        <div
          style={{
            transform: isVisible
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.95)",
            opacity: isVisible ? 1 : 0,
            transition: isVisible
              ? "transform 80ms cubic-bezier(0.16, 1, 0.3, 1), opacity 80ms ease-out"
              : "transform 120ms ease-in-out, opacity 120ms ease-in-out",
          }}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}
