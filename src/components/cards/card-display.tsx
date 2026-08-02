import Image from "next/image";
import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RemoveChaseButton from "@/components/collection/remove-chase-button";

type CardDisplayProps = {
  card: {
    id: string;
    name: string;
    image: {
      medium: string | null;
    } | null;
    set: {
      name: string;
    } | null;
    attributes: unknown;
  };
  showRemoveChase?: boolean;
  wishlistItemId?: string;
  isMarketplaceCard?: boolean;
  wantedByUserId?: string;
  requestId?: string;
};

export default function CardDisplay({
  card,
  showRemoveChase = false,
  wishlistItemId,
  isMarketplaceCard = false,
  wantedByUserId,
  requestId,
}: CardDisplayProps) {
  const attributes = card.attributes as Record<string, string>;

  return (
    <div>
      <Card
        style={{
          width: "220px",
          overflow: "hidden",
          padding: "16px",
          borderRadius: "8px",
        }}
        className="hover:shadow-lg transition-shadow"
      >
        <Link href={`/cards/${card.id}${showRemoveChase ? "?from=chase" : ""}`}>
          <CardHeader style={{ padding: "0px" }}>
            {card.image?.medium && (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "2.5 / 3.5",
                  position: "relative",
                }}
              >
                <Image
                  src={card.image.medium}
                  alt={`${card.name} card image`}
                  fill
                  style={{
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}

            <CardTitle
              style={{
                fontSize: "16px",
              }}
            >
              {card.name}
            </CardTitle>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {card.set?.name && (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {card.set.name}
                </span>
              )}

              {attributes.Rarity && (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    backgroundColor: "#fef3c7",
                    border: "1px solid #f59e0b",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {attributes.Rarity}
                </span>
              )}
            </div>
          </CardHeader>
        </Link>

        {isMarketplaceCard && wantedByUserId && (
          <CardFooter
            style={{
              padding: "0px",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <p>
              <strong>Wanted by: </strong> {wantedByUserId}
            </p>
            <Link
              href={`/marketplace/${requestId}`}
              className="hover:bg-gray-100 transition-colors"
              style={{
                display: "inline-block",
                marginTop: "16px",
                border: "1px solid #d1d5db",
                padding: "8px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Make Offer
            </Link>
          </CardFooter>
        )}

        {/* {showRemoveChase && wishlistItemId && (
          <CardFooter style={{ padding: "0px" }}>
            <RemoveChaseButton
              wishlistItemId={wishlistItemId}
              cardId={card.id}
            />
          </CardFooter>
        )} */}
      </Card>
    </div>
  );
}
