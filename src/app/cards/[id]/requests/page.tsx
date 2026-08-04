import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import RequestList from "@/components/requests/card-request-list";
import { getCard } from "@/lib/cards/getCard";
import CardPageViewButton from "@/components/cards/card-page-view-button";

export default async function RequestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: cardId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return (
      <main style={{ padding: "10px 20px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          Chase Requests
        </h1>

        <p>You must be signed in.</p>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return null;
  }

  const card = await getCard(cardId);

  if (!card) {
    return null;
  }

  const requests = await prisma.chaseRequest.findMany({
    where: {
      wishlistItem: {
        userId: user.id,
        cardId,
      },
      status: "OPEN",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      offers: true,
      wishlistItem: {
        include: {
          user: true,
          card: {
            include: {
              image: true,
              set: true,
              tcg: true,
            },
          },
        },
      },
    },
  });

  const serializedRequests = requests.map((request) => ({
    ...request,
    price: request.price?.toNumber() ?? null,
    minPrice: request.minPrice?.toNumber() ?? null,
    maxPrice: request.maxPrice?.toNumber() ?? null,
    offers: request.offers.map((offer) => ({
      ...offer,
      price: offer.price.toNumber(),
    })),
  }));

  return (
    <main
      style={{
        padding: "10px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            {card.name}
          </h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            {card.tcg.name} • {card.set.name}
          </p>
        </div>

        <CardPageViewButton cardId={cardId} />
      </div>

      <RequestList cardId={cardId} requests={serializedRequests} />
    </main>
  );
}
