import CardHeader from "@/components/cards/card-header";
import CardImage from "@/components/cards/card-image";
import CardDetails from "@/components/cards/card-details";
import CardMarket from "@/components/cards/card-market";
import CardAction from "@/components/cards/card-actions";
import CardModalTabs from "@/components/cards/card-tabs";

import { CardContext, CardWithDetails } from "@/lib/cards/types";

type CardModalViewProps = {
  card: CardWithDetails;
  context: CardContext;
  wishlistItemId?: string;
  collectionItemId?: string;
  showRequest?: boolean;
  requestContent?: React.ReactNode;
};

export default function CardModalView({
  card,
  context,
  wishlistItemId,
  collectionItemId,
  showRequest = false,
  requestContent,
}: CardModalViewProps) {
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
    <>
      <CardHeader card={card} />

      <CardModalTabs
        showRequest={showRequest}
        image={<CardImage src={card.image?.medium} name={card.name} />}
        details={<CardDetails card={card} />}
        market={<CardMarket markets={markets} />}
        editRequest={requestContent}
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
          collectionItemId={collectionItemId}
          wishlistItemId={wishlistItemId}
        />
      </div>
    </>
  );
}
