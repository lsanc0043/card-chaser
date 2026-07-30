import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { removeFromChase } from "@/app/actions/chase";
import { auth } from "@clerk/nextjs/server";
import ChaseToggleButton from "@/components/chase-toggle-button";
import CloseModalButton from "@/components/close-modal-button";
import Image from "next/image";
import TcgplayerButton from "@/components/tcgplayer-button";
import ModalWrapper from "@/components/modal-wrapper";
import CardModalTabs from "@/components/card-details-tabs";
import { Edit } from "lucide-react";
import Link from "next/link";

export default async function CardModal({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;
  const { from } = await searchParams;
  const fromChase = from === "chase";

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

  const chaseItem = user
    ? await prisma.chaseItem.findFirst({
        where: {
          userId: user.id,
          cardId: card.id,
        },
        include: {
          request: {
            include: {
              offers: true,
            },
          },
        },
      })
    : null;

  const attributes = card.attributes as Record<string, string>;
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

  const detailsContent = (
    <div
      style={{
        flex: 1,
        width: "100%",
      }}
    >
      <section>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "8px",
            borderBottom: "1px solid gray",
          }}
        >
          Card Details
        </h2>
        {attributes.Number && (
          <p>
            <strong>Number:</strong> {attributes.Number}
          </p>
        )}

        {(attributes["Card Type"] || attributes.HP || attributes.Stage) && (
          <p>
            <strong>Type / HP / Stage: </strong>
            {attributes["Card Type"] || "—"} / {attributes.HP || "—"} /{" "}
            {attributes.Stage || "—"}
          </p>
        )}

        {card.set.releaseDate && (
          <p>
            <strong>Release Date: </strong>
            {new Date(card.set.releaseDate).toLocaleDateString()}
          </p>
        )}

        {attributes.CardText && (
          <section
            style={{
              marginTop: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "8px",
                borderBottom: "1px solid gray",
              }}
            >
              Card Text
            </h2>

            <div
              dangerouslySetInnerHTML={{
                __html: attributes.CardText,
              }}
            />
          </section>
        )}

        {attributes["Attack 1"] && (
          <p
            dangerouslySetInnerHTML={{
              __html: `<strong>Attack 1:</strong> ${attributes["Attack 1"].replace(/\r\n/g, "")}`,
            }}
          />
        )}

        {(attributes.Weakness ||
          attributes.Resistance ||
          attributes.RetreatCost) && (
          <p>
            <strong>Weakness / Resistance / Retreat Cost: </strong>
            {attributes.Weakness || "—"} / {attributes.Resistance || "—"} /{" "}
            {attributes.RetreatCost || "—"}
          </p>
        )}
      </section>

      <section
        style={{
          marginTop: "10px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "8px",
            borderBottom: "1px solid gray",
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
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <TcgplayerButton url={markets?.tcgplayer?.url} />
        </div>
      </section>
    </div>
  );

  const editRequestContent = (
    <div
      style={{
        flex: 1,
        width: "500px",
      }}
    >
      <section>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "8px",
            borderBottom: "1px solid gray",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Request Details</span>

          <Link
            href={`/cards/${card.id}/request`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Edit />
          </Link>
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
              ["Status", chaseItem?.status],
              [
                "Created On",
                chaseItem?.createdAt &&
                  new Date(chaseItem?.createdAt).toLocaleDateString(),
              ],
              [
                "Price",
                chaseItem?.request?.useRange
                  ? `$${chaseItem.request.minPrice} - ${chaseItem.request.maxPrice}`
                  : `$${chaseItem?.request?.price}`,
              ],
              ["Conditions", chaseItem?.request?.conditions.join(", ")],
              ["Quantity", chaseItem?.request?.quantity],
              ["# of Offers", chaseItem?.request?.offers.length],
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
                  {value != null ? value : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );

  return (
    <ModalWrapper>
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "32px",
        }}
      >
        <CloseModalButton />

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
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {card.name}
          </h1>

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
              {card.set?.name}
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

        <CardModalTabs
          showTabs={fromChase}
          image={
            card.image?.medium && (
              <Image
                src={card.image.medium}
                alt={`${card.name} card image`}
                width={320}
                height={448}
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                }}
              />
            )
          }
          details={detailsContent}
          editRequest={editRequestContent}
        />

        <div
          style={{
            paddingTop: "16px",
            marginTop: "16px",
            borderTop: "1px solid gray",
            justifyContent: "flex-end",
            display: "flex",
            width: "100%",
          }}
        >
          <ChaseToggleButton
            userId={userId}
            cardId={card.id}
            chaseItemId={chaseItem?.id}
            removeAction={async () => {
              "use server";

              if (chaseItem) {
                await removeFromChase(chaseItem.id, card.id);
              }
            }}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
