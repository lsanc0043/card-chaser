import CardHeader from "./card-header";
import CardImage from "./card-image";
import CardDetails from "./card-details";
import CardMarket from "./card-market";
import CardAction from "./card-actions";
import { CardContext, CardWithDetails } from "@/lib/cards/types";

export default function CardPageView({
  card,
  context,
  wishlistItemId,
  collectionItemId,
}: {
  card: CardWithDetails;
  context: CardContext;
  wishlistItemId?: string;
  collectionItemId?: string;
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
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <CardHeader card={card} />
        <CardAction
          cardId={card.id}
          context={context}
          wishlistItemId={wishlistItemId}
          collectionItemId={collectionItemId}
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
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <CardDetails card={card} />

          <CardMarket markets={markets} />
        </div>
      </div>
    </div>
  );
}
