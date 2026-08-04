import CardHeader from "@/components/cards/card-header";
import CardImage from "@/components/cards/card-image";
import CardDetails from "@/components/cards/card-details";
import CardMarket from "@/components/cards/card-market";
import CardAction from "@/components/cards/card-actions";
import CardModalTabs from "@/components/cards/card-tabs";

import {
  CardContext,
  CardMarkets,
  CardWithDetails,
  UserCollectionItem,
  SerializedWishlistItemWithRequests,
} from "@/lib/types";
import CardCollectionDetails from "../collection/card-collection-details";
import CardWishlistDetails from "../wishlist/card-wishlist-details";

type CardModalViewProps = {
  card: CardWithDetails;
  context: CardContext;
  collectionItems: UserCollectionItem[];
  wishlistItem?: SerializedWishlistItemWithRequests | null;
  requestContent?: React.ReactNode;
};

export default function CardModalView({
  card,
  context,
  collectionItems,
  wishlistItem,
  requestContent,
}: CardModalViewProps) {
  const markets = card.markets as CardMarkets;

  return (
    <>
      <CardHeader card={card} />

      <CardModalTabs
        image={<CardImage src={card.image?.medium} name={card.name} />}
        details={<CardDetails card={card} />}
        market={<CardMarket markets={markets} />}
        collection={<CardCollectionDetails collectionItems={collectionItems} />}
        wishlist={<CardWishlistDetails wishlistItem={wishlistItem} />}
        request={requestContent}
        showCollection={context === "collection"}
        showWishlist={context === "wishlist"}
        showRequest={context === "requests"}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: "8px",
        }}
      >
        <CardAction
          cardId={card.id}
          context={context}
          collectionItems={collectionItems}
          wishlistItem={wishlistItem}
        />
      </div>
    </>
  );
}
