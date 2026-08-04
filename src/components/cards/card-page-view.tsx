import CardHeader from "./card-header";
import CardImage from "./card-image";
import CardDetails from "./card-details";
import CardMarket from "./card-market";
import CardAction from "./card-actions";
import {
  CardContext,
  CardWithDetails,
  UserCollectionItem,
  SerializedWishlistItemWithRequests,
} from "@/lib/types";
import CardCollectionDetails from "../collection/card-collection-details";
import CardWishlistDetails from "../wishlist/card-wishlist-details";

export default function CardPageView({
  card,
  context,
  wishlistItem,
  collectionItems,
}: {
  card: CardWithDetails;
  context: CardContext;
  wishlistItem?: SerializedWishlistItemWithRequests | null;
  collectionItems: UserCollectionItem[];
}) {
  const markets = card.markets as {
    tcgplayer?: {
      url?: string;
      prices?: {
        low?: number | null;
        mid?: number | null;
        high?: number | null;
        market?: number | null;
      };
    };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <CardHeader card={card} />

        <CardAction
          cardId={card.id}
          context={context}
          wishlistItem={wishlistItem}
          collectionItems={collectionItems}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        <CardImage src={card.image?.medium} name={card.name} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {collectionItems.length > 0 && (
            <CardCollectionDetails collectionItems={collectionItems} />
          )}

          {wishlistItem && <CardWishlistDetails wishlistItem={wishlistItem} />}

          <CardDetails card={card} />

          <CardMarket markets={markets} />
        </div>
      </div>
    </div>
  );
}
