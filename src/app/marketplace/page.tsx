import AuthRequiredModal from "@/components/auth-required-modal";
import MarketplaceTable from "@/components/marketplace-table";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function MarketplacePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main style={{ padding: "32px" }}>
        <h1>Open Chase Requests</h1>
        <AuthRequiredModal redirectUrl="/marketplace" />
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  const requests = await prisma.chaseItem.findMany({
    where: {
      status: "OPEN",
      request: {
        isNot: null,
      },
      user: {
        clerkId: {
          not: userId,
        },
      },
    },
    include: {
      card: {
        include: {
          set: true,
          image: true,
        },
      },
      user: true,
      request: {
        include: {
          offers: user
            ? {
                where: {
                  sellerId: user.id,
                },
              }
            : false,
        },
      },
    },
  });

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
        Open Chase Requests
      </h1>

      <MarketplaceTable
        requests={requests.map((item) => ({
          id: item.id,
          status: item.status,
          createdAt: item.createdAt.toISOString(),

          user: {
            displayName: item.user.displayName ?? "N/A",
          },

          card: {
            id: item.card.id,
            name: item.card.name,

            attributes: {
              Rarity:
                (item.card.attributes as Record<string, string>)?.Rarity ?? "",
            },

            set: item.card.set
              ? {
                  name: item.card.set.name,
                }
              : null,

            image: item.card.image?.small
              ? {
                  small: item.card.image.small,
                }
              : null,
          },

          request: {
            id: item.request!.id,
            price: item.request!.price?.toString() ?? null,
            minPrice: item.request!.minPrice?.toString() ?? null,
            maxPrice: item.request!.maxPrice?.toString() ?? null,
            useRange: item.request!.useRange,
            conditions: item.request!.conditions,
            quantity: item.request!.quantity,
            offers: item.request!.offers.map((offer) => ({ id: offer.id })),
          },
        }))}
      />
    </main>
  );
}
