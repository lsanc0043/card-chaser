import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { removeFromChase } from "@/actions/chase";
import { auth } from "@clerk/nextjs/server";
import ChaseToggleButton from "@/components/chase-toggle-button";
import Image from "next/image";
import TcgplayerButton from "@/components/tcgplayer-button";

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

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

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
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

          <div
            style={{
              marginLeft: "auto",
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

        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div>
            {card.image?.medium && (
              <Image
                src={card.image.medium}
                alt={`${card.name} card`}
                width={320}
                height={448}
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                }}
              />
            )}
          </div>

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

              {(attributes["Card Type"] ||
                attributes.HP ||
                attributes.Stage) && (
                <p>
                  <strong>Type / HP / Stage: </strong>
                  {attributes["Card Type"] || "—"} / {attributes.HP || "—"} /{" "}
                  {attributes.Stage || "—"}
                </p>
              )}

              {card.set.releaseDate && (
                <p>
                  <strong>Release Date:</strong>{" "}
                  {new Date(card.set.releaseDate).toLocaleDateString()}
                </p>
              )}

              {(attributes.Weakness ||
                attributes.Resistance ||
                attributes.RetreatCost) && (
                <p>
                  <strong>Weakness / Resistance / Retreat Cost:</strong>{" "}
                  {attributes.Weakness || "—"} / {attributes.Resistance || "—"}{" "}
                  / {attributes.RetreatCost || "—"}
                </p>
              )}
            </section>

            {attributes.CardText && (
              <section style={{ marginTop: "20px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
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
                style={{
                  marginTop: "20px",
                }}
                dangerouslySetInnerHTML={{
                  __html: `<strong>Attack 1:</strong> ${attributes[
                    "Attack 1"
                  ].replace(/\r\n/g, "")}`,
                }}
              />
            )}

            <section style={{ marginTop: "24px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  borderBottom: "1px solid gray",
                }}
              >
                Market
              </h2>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
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
                          padding: "8px",
                          fontWeight: 600,
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {label}
                      </td>

                      <td
                        style={{
                          padding: "8px",
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
        </div>
      </div>
    </main>
  );
}
