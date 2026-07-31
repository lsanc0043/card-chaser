import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import OffersTable from "@/components/offers-table";

export default async function OffersPage() {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  const offers = await prisma.offer.findMany({
    where: {
      sellerId: user?.id,
    },
    include: {
      chaseRequest: {
        include: {
          chaseItem: {
            include: {
              card: {
                include: {
                  image: true,
                  set: true,
                },
              },
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(offers);

  return (
    <main
      style={{
        padding: "10px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "10px",
        }}
      >
        My Offers
      </h1>

      <OffersTable
        offers={offers.map((offer) => {
          const attributes = offer.chaseRequest.chaseItem.card
            .attributes as Record<string, string>;
          return {
            ...offer,
            price: offer.price?.toString() ?? null,
            chaseRequest: {
              ...offer.chaseRequest,
              price: offer.chaseRequest.price?.toString() ?? null,
              minPrice: offer.chaseRequest.minPrice?.toString() ?? null,
              maxPrice: offer.chaseRequest.maxPrice?.toString() ?? null,
              chaseItem: {
                ...offer.chaseRequest.chaseItem,
                card: { ...offer.chaseRequest.chaseItem.card, attributes },
              },
            },
          };
        })}
      />
    </main>
  );
}
