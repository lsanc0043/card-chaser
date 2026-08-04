import CollectionToggleButton from "../collection/collection-toggle-button";
import WishlistToggleButton from "../wishlist/wishlist-toggle-button";
import {
  CardContext,
  UserCollectionItem,
  SerializedWishlistItemWithRequests,
} from "@/lib/types";
import EditCollectionButton from "../collection/edit-collection-button";
import Link from "next/link";

type CardActionProps = {
  context: CardContext;
  cardId: string;
  collectionItems: UserCollectionItem[];
  wishlistItem?: SerializedWishlistItemWithRequests | null;
};

export default function CardAction({
  context,
  cardId,
  collectionItems,
  wishlistItem,
}: CardActionProps) {
  const requests = wishlistItem?.chaseRequests ?? [];
  function getActions() {
    switch (context) {
      case "collection":
        return (
          <>
            <EditCollectionButton
              cardId={cardId}
              collectionItems={collectionItems}
            />

            <CollectionToggleButton
              cardId={cardId}
              collectionItems={collectionItems}
            />
          </>
        );

      case "wishlist":
        return (
          <>
            <WishlistToggleButton cardId={cardId} wishlistItem={wishlistItem} />

            <CollectionToggleButton
              cardId={cardId}
              collectionItems={collectionItems}
            />
          </>
        );

      case "requests":
        return (
          <Link
            href={`/cards/${cardId}/requests`}
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
            {requests.length > 0
              ? `View Requests (${requests.length})`
              : "Create Request"}
          </Link>
        );

      default:
        return (
          <>
            <CollectionToggleButton
              cardId={cardId}
              collectionItems={collectionItems}
            />

            <WishlistToggleButton cardId={cardId} wishlistItem={wishlistItem} />
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
