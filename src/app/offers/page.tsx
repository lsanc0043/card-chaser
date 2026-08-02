import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import OffersTable from "@/components/offers-table";
import { getCardFilters } from "@/lib/cards/getCardFilters";
import { buildCardWhere } from "@/lib/cards/buildCardWhere";
import ActiveFilters from "@/components/cards/active-filters";
import CardSearch from "@/components/cards/card-search";

export default async function OffersPage({
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

  if (!userId) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  const filters = await getCardFilters(searchParams);
  const hasFilters = Object.values(filters).some(Boolean);

  const offers = await prisma.offer.findMany({
    where: {
      sellerId: user?.id,
      chaseRequest: {
        wishlistItem: {
          card: buildCardWhere(filters),
        },
      },
    },
    include: {
      chaseRequest: {
        include: {
          wishlistItem: {
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

      <div style={{ marginBottom: "10px", display: "flex", gap: 10 }}>
        <CardSearch basePath="offers" />
      </div>

      <ActiveFilters basePath="offers" />

      {hasFilters && offers.length > 0 && (
        <p
          style={{
            color: "#6b7280",
            margin: "5px 5px 10px",
          }}
        >
          Showing {offers.length} offer
          {offers.length !== 1 ? "s" : ""}
        </p>
      )}

      <div>
        {offers.length === 0 ? (
          <p
            style={{
              color: "#6b7280",
              margin: "5px 5px 10px",
            }}
          >
            No offers found. Try adjusting your search or filters.
          </p>
        ) : (
          <OffersTable
            offers={offers.map((offer) => {
              const attributes = offer.chaseRequest.wishlistItem.card
                .attributes as Record<string, string>;
              return {
                ...offer,
                price: offer.price?.toString() ?? null,
                chaseRequest: {
                  ...offer.chaseRequest,
                  price: offer.chaseRequest.price?.toString() ?? null,
                  minPrice: offer.chaseRequest.minPrice?.toString() ?? null,
                  maxPrice: offer.chaseRequest.maxPrice?.toString() ?? null,
                  wishlistItem: {
                    ...offer.chaseRequest.wishlistItem,
                    card: {
                      ...offer.chaseRequest.wishlistItem.card,
                      attributes,
                    },
                  },
                },
              };
            })}
          />
        )}
      </div>
    </main>
  );
}
