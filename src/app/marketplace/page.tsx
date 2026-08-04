import ActiveFilters from "@/components/browse/active-filters";
import CardSearch from "@/components/browse/card-search";
import MarketplaceTable from "@/components/marketplace/marketplace-table";
import { buildCardWhere } from "@/lib/cards/buildCardWhere";
import { getCardFilters } from "@/lib/cards/getCardFilters";
import prisma from "@/lib/prisma";
import {
  MarketplaceChaseRequest,
  SerializedMarketplaceChaseRequest,
} from "@/lib/types";
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

  const requests: MarketplaceChaseRequest[] =
    await prisma.chaseRequest.findMany({
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

  const serializedRequests: SerializedMarketplaceChaseRequest[] = requests.map(
    (request) => ({
      ...request,
      price: request.price?.toNumber() ?? null,
      minPrice: request.minPrice?.toNumber() ?? null,
      maxPrice: request.maxPrice?.toNumber() ?? null,

      offers: request.offers.map((offer) => ({
        ...offer,
        price: offer.price.toNumber(),
      })),
    }),
  );

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

      {hasFilters && serializedRequests.length > 0 && (
        <p
          style={{
            color: "#6b7280",
            margin: "5px 5px 10px",
          }}
        >
          Showing {serializedRequests.length} request
          {serializedRequests.length !== 1 ? "s" : ""}
        </p>
      )}

      <div>
        {serializedRequests.length === 0 ? (
          <p
            style={{
              color: "#6b7280",
              margin: "5px 5px 10px",
            }}
          >
            No requests found. Try adjusting your search or filters.
          </p>
        ) : (
          <MarketplaceTable loggedIn={loggedIn} requests={serializedRequests} />
        )}
      </div>
    </main>
  );
}
