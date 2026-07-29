import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RemoveChaseButton from "@/components/remove-chase-button";
import { cardConditions } from "@/constants/cardConditions";
import { auth } from "@clerk/nextjs/server";
import AuthRequiredModal from "@/components/auth-required-modal";

export default async function ChasePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          My Chase List
        </h1>

        <AuthRequiredModal redirectUrl={"/chase"} />
      </main>
    );
  }

  const chaseItems = await prisma.chaseItem.findMany({
    where: {
      user: {
        clerkId: userId,
      },
    },
    include: {
      card: true,
      offers: {
        include: {
          seller: true,
        },
      },
    },
  });

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "1024px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "32px",
        }}
      >
        My Chase List
      </h1>

      <div
        style={{
          display: "grid",
          gap: "24px",
        }}
      >
        {chaseItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.card.name}</CardTitle>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Badge>{item.card.setName}</Badge>

                <Badge variant="secondary">{item.card.rarity}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <h3
                style={{
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Seller Offers
              </h3>

              {item.offers.length === 0 ? (
                <p
                  style={{
                    color: "#6b7280",
                  }}
                >
                  No offers yet.
                </p>
              ) : (
                item.offers.map((offer) => (
                  <div
                    key={offer.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "12px",
                    }}
                  >
                    <p>
                      Seller:{" "}
                      {offer.seller.displayName || offer.seller.username}
                    </p>

                    <p>Price: ${offer.price}</p>

                    <p>
                      Condition:{" "}
                      {
                        cardConditions.find((c) => c.value === offer.condition)
                          ?.label
                      }
                    </p>

                    <p
                      style={{
                        marginTop: "8px",
                      }}
                    >
                      {offer.message}
                    </p>

                    <Button
                      style={{
                        marginTop: "16px",
                      }}
                    >
                      Review Offer
                    </Button>
                  </div>
                ))
              )}
            </CardContent>

            <RemoveChaseButton chaseItemId={item.id} />
          </Card>
        ))}
      </div>
    </main>
  );
}
