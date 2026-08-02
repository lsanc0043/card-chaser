import { removeFromCollection } from "@/actions/collection";
import CollectionToggleButton from "../collection/collection-toggle-button";
import WishlistToggleButton from "../wishlist/wishlist-toggle-button";
import { removeFromWishlist } from "@/actions/wishlist";
import { CardContext } from "@/lib/cards/types";

type CardActionProps = {
  context: CardContext;
  cardId: string;
  collectionItemId?: string;
  wishlistItemId?: string;
  requestId?: string;
};

export default function CardAction({
  context,
  cardId,
  collectionItemId,
  wishlistItemId,
}: CardActionProps) {
  function getActions() {
    switch (context) {
      case "collection":
        return (
          <>
            <button
              className="transition-shadow hover:shadow-lg hover:ring-2 hover:ring-blue-500"
              style={{
                border: "1px solid #2563eb",
                padding: "10px 18px",
                borderRadius: "0.75rem",
                backgroundColor: "#2563eb",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
                marginTop: "8px",
              }}
            >
              Edit Collection Details
            </button>
            <CollectionToggleButton
              cardId={cardId}
              collectionItemId={collectionItemId}
              removeAction={async () => {
                "use server";

                if (collectionItemId) {
                  await removeFromCollection(collectionItemId, cardId);
                }
              }}
            />

            <WishlistToggleButton
              cardId={cardId}
              wishlistItemId={wishlistItemId}
              removeAction={async () => {
                "use server";

                if (wishlistItemId) {
                  await removeFromWishlist(wishlistItemId, cardId);
                }
              }}
            />
          </>
        );

      case "wishlist":
        return (
          <>
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
            >
              Edit/Create Request
            </button>
            <WishlistToggleButton
              cardId={cardId}
              wishlistItemId={wishlistItemId}
              removeAction={async () => {
                "use server";

                if (wishlistItemId) {
                  await removeFromWishlist(wishlistItemId, cardId);
                }
              }}
            />
            <CollectionToggleButton
              cardId={cardId}
              collectionItemId={collectionItemId}
              removeAction={async () => {
                "use server";

                if (collectionItemId) {
                  await removeFromCollection(collectionItemId, cardId);
                }
              }}
            />
          </>
        );

      case "requests":
        return (
          <>
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
            >
              Edit Request
            </button>
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
            >
              Delete Request
            </button>
          </>
        );

      default:
        return (
          <>
            <CollectionToggleButton
              cardId={cardId}
              collectionItemId={collectionItemId}
              removeAction={async () => {
                "use server";

                if (collectionItemId) {
                  await removeFromCollection(collectionItemId, cardId);
                }
              }}
            />

            <WishlistToggleButton
              cardId={cardId}
              wishlistItemId={wishlistItemId}
              removeAction={async () => {
                "use server";

                if (wishlistItemId) {
                  await removeFromWishlist(wishlistItemId, cardId);
                }
              }}
            />
          </>
        );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
      }}
    >
      {getActions()}
    </div>
  );
}
