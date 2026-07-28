import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RemoveChaseButton from "@/components/remove-chase-button";
import { cardConditions } from "@/constants/cardConditions";

export default async function ChasePage() {
  const chaseItems = await prisma.chaseItem.findMany({
    where: {
      user: {
        email: "buyer@example.com",
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
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Chase List</h1>

      <div className="grid gap-6">
        {chaseItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.card.name}</CardTitle>

              <div className="flex gap-2">
                <Badge>{item.card.setName}</Badge>

                <Badge variant="secondary">{item.card.rarity}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <h3 className="font-semibold mb-3">Seller Offers</h3>

              {item.offers.length === 0 ? (
                <p className="text-muted-foreground">No offers yet.</p>
              ) : (
                item.offers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4 mb-3">
                    <p>Seller: {offer.seller.username}</p>

                    <p>Price: ${offer.price}</p>

                    <p>
                      Condition:{" "}
                      {
                        cardConditions.find((c) => c.value === offer.condition)
                          ?.label
                      }
                    </p>

                    <p className="mt-2">{offer.message}</p>

                    <Button className="mt-4">Review Offer</Button>
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
