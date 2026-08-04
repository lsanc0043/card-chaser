import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContext, CardWithDetails, UserCollectionItem } from "@/lib/types";

type CardDisplayProps = {
  card: CardWithDetails;
  context: CardContext;
  collectionItems?: UserCollectionItem[];
};

export default function CardDisplay({
  card,
  context,
  collectionItems,
}: CardDisplayProps) {
  function getContextSpecificDetails() {
    switch (context) {
      case "collection":
        const totalQuantity =
          collectionItems?.reduce((total, item) => total + item.quantity, 0) ??
          0;
        return (
          <div>
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                }}
              >
                {"Collection"}
              </p>

              <p>
                Owned: <strong>{totalQuantity}</strong>
              </p>
            </div>
          </div>
        );
      default:
        return <></>;
    }
  }

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
        <Link href={`/cards/${card.id}?context=${context}`}>
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
        {getContextSpecificDetails()}
      </Card>
    </div>
  );
}
