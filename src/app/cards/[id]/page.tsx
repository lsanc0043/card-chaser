import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { removeFromWishlist } from "@/actions/wishlist";
import { removeFromCollection } from "@/actions/collection";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Edit } from "lucide-react";

import TcgplayerButton from "@/components/tcgplayer-button";
import CollectionToggleButton from "@/components/collection/collection-toggle-button";
import WishlistToggleButton from "@/components/wishlist/wishlist-toggle-button";
import { mapCardDetails } from "@/lib/cards/mapCardDetails";

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const card = await prisma.card.findUnique({
    where: {
      id,
    },
    include: {
      set: true,
      tcg: true,
      image: true,
    },
  });

  if (!card) {
    notFound();
  }

  const user = userId
    ? await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      })
    : null;

  const wishlistItem = user
    ? await prisma.wishlistItem.findFirst({
        where: {
          userId: user.id,
          cardId: card.id,
        },
        include: {
          chaseRequest: {
            include: {
              offers: true,
            },
          },
        },
      })
    : null;

  const collectionItem = user
    ? await prisma.collectionItem.findFirst({
        where: {
          userId: user.id,
          cardId: card.id,
        },
      })
    : null;

  const attributes = card.attributes as Record<string, string>;

  const details = mapCardDetails(attributes, card.set?.releaseDate);

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

  const prices = markets?.tcgplayer?.prices;

  return (
    <main
      style={{
        padding: "10px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(32px,5vw,48px)",
            fontWeight: 700,
          }}
        >
          {card.name}
        </h1>

        {card.set?.name && (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              background: "#f3f4f6",
              border: "1px solid #d1d5db",
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
              background: "#fef3c7",
              border: "1px solid #f59e0b",
            }}
          >
            {attributes.Rarity}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "40px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: "20px",
          }}
        >
          {card.image?.medium && (
            <Image
              src={card.image.medium}
              alt={card.name}
              width={320}
              height={448}
              style={{
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,.15)",
              }}
            />
          )}
        </div>

        <div>
          <section>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                borderBottom: "1px solid #ddd",
                marginBottom: "16px",
              }}
            >
              Card Details
            </h2>

            {details.sections.map((section, index) => (
              <section key={section.title || index}>
                {section.title && (
                  <h3
                    style={{
                      fontWeight: 700,
                      marginTop: "16px",
                    }}
                  >
                    {section.title}
                  </h3>
                )}

                {section.fields.map((field) => (
                  <p key={field.label}>
                    {field.html ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `<strong>${field.label}</strong> ${field.value}`,
                        }}
                      />
                    ) : (
                      <>
                        {field.label && <strong>{field.label}: </strong>}
                        {field.value}
                      </>
                    )}
                  </p>
                ))}
              </section>
            ))}
          </section>

          <section
            style={{
              marginTop: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                borderBottom: "1px solid #ddd",
              }}
            >
              Market
            </h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "16px",
                fontSize: "15px",
              }}
            >
              <tbody>
                {[
                  ["Low", prices?.low],
                  ["Mid", prices?.mid],
                  ["High", prices?.high],
                  ["Market", prices?.market],
                ].map(([label, value]) => (
                  <tr key={label as string}>
                    <td
                      style={{
                        padding: "8px 12px",
                        fontWeight: 600,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {label}
                    </td>

                    <td
                      style={{
                        padding: "8px 12px",
                        textAlign: "right",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {value != null
                        ? `$${Number(value).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <TcgplayerButton url={markets?.tcgplayer?.url} />
          </section>

          {wishlistItem?.chaseRequest && (
            <section
              style={{
                marginTop: "40px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                Request Details
                <Link href={`/cards/${card.id}/request`}>
                  <Edit size={20} />
                </Link>
              </h2>

              <p>
                <strong>Status:</strong> {wishlistItem.status}
              </p>

              <p>
                <strong>Quantity:</strong> {wishlistItem.chaseRequest.quantity}
              </p>

              <p>
                <strong>Conditions:</strong>{" "}
                {wishlistItem.chaseRequest.conditions.join(", ")}
              </p>
            </section>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <CollectionToggleButton
          cardId={card.id}
          collectionItemId={collectionItem?.id}
          removeAction={async () => {
            "use server";

            if (collectionItem) {
              await removeFromCollection(collectionItem.id, card.id);
            }
          }}
        />

        <WishlistToggleButton
          cardId={card.id}
          wishlistItemId={wishlistItem?.id}
          removeAction={async () => {
            "use server";

            if (wishlistItem) {
              await removeFromWishlist(wishlistItem.id, card.id);
            }
          }}
        />
      </div>
    </main>
  );
}
