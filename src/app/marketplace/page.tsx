import ActiveFilters from "@/components/cards/active-filters";
import CardSearch from "@/components/cards/card-search";
import MarketplaceTable from "@/components/marketplace-table";
import { buildCardWhere } from "@/lib/cards/buildCardWhere";
import { getCardFilters } from "@/lib/cards/getCardFilters";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tcg?: string;
    rarity?: string;
    set?: string;
  }>;
}) {
  const { userId } = await auth();

  const user = userId
    ? await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      })
    : null;

  const loggedIn = !!user;

  const filters = await getCardFilters(searchParams);
  const hasFilters = Object.values(filters).some(Boolean);

  const requests = await prisma.chaseRequest.findMany({
    where: {
      wishlistItem: {
        user: {
          clerkId: {
            not: user?.clerkId,
          },
        },
        card: buildCardWhere(filters),
      },
    },
    include: {
      offers: true,
      wishlistItem: {
        include: {
          card: {
            include: {
              set: true,
              image: true,
            },
          },
          user: true,
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

      <div style={{ marginBottom: "10px", display: "flex", gap: 10 }}>
        <CardSearch basePath="marketplace" />
      </div>

      <ActiveFilters basePath="marketplace" />

      {hasFilters && requests.length > 0 && (
        <p
          style={{
            color: "#6b7280",
            margin: "5px 5px 10px",
          }}
        >
          Showing {requests.length} request
          {requests.length !== 1 ? "s" : ""}
        </p>
      )}

      <div>
        {requests.length === 0 ? (
          <p
            style={{
              color: "#6b7280",
              margin: "5px 5px 10px",
            }}
          >
            No requests found. Try adjusting your search or filters.
          </p>
        ) : (
          <MarketplaceTable
            loggedIn={loggedIn}
            requests={requests.map((request) => ({
              id: request.id,
              status: request.status,
              createdAt: request.createdAt.toISOString(),

              user: {
                displayName:
                  request.wishlistItem.user.displayName ??
                  request.wishlistItem.user.username,
              },

              card: {
                id: request.wishlistItem.card.id,
                name: request.wishlistItem.card.name,

                attributes: {
                  Rarity:
                    (
                      request.wishlistItem.card.attributes as Record<
                        string,
                        string
                      >
                    )?.Rarity ?? "",
                },

                set: request.wishlistItem.card.set
                  ? {
                      name: request.wishlistItem.card.set.name,
                    }
                  : null,

                image: request.wishlistItem.card.image?.small
                  ? {
                      small: request.wishlistItem.card.image.small,
                    }
                  : null,
              },

              request: {
                id: request!.id,
                price: request.price?.toString() ?? null,
                minPrice: request.minPrice?.toString() ?? null,
                maxPrice: request.maxPrice?.toString() ?? null,
                useRange: request.useRange,
                conditions: request.conditions,
                quantity: request.quantity,
                offers: request.offers.map((offer) => ({
                  id: offer.id,
                })),
              },
            }))}
          />
        )}
      </div>
    </main>
  );
}
