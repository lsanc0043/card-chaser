"use client";

import Link from "next/link";

export default function WishlistToggleButton({
  cardId,
  wishlistItemId,
  removeAction,
}: {
  cardId: string;
  wishlistItemId?: string;
  removeAction: () => Promise<void>;
}) {
  const inWishlist = !!wishlistItemId;

  return inWishlist ? (
    <button
      className="transition-shadow hover:shadow-lg hover:ring-2 hover:ring-red-500"
      style={{
        border: "1px solid #dc2626",
        padding: "10px 18px",
        borderRadius: "0.75rem",
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        cursor: "pointer",
        fontWeight: 600,
        marginTop: "8px",
      }}
      onClick={removeAction}
    >
      Remove from Wishlist
    </button>
  ) : (
    <Link
      href={`/cards/${cardId}/request`}
      className="transition-shadow hover:shadow-lg hover:ring-2 hover:ring-blue-500"
      style={{
        display: "inline-block",
        border: "1px solid #2563eb",
        padding: "10px 18px",
        borderRadius: "0.75rem",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: 600,
        textDecoration: "none",
        marginTop: "8px",
      }}
    >
      Add to Wishlist
    </Link>
  );
}
