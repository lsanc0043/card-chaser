import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import AuthRequiredModal from "@/components/modals/auth-required-modal";
import CardDisplay from "@/components/cards/card-display";
import { getCardFilters } from "@/lib/cards/getCardFilters";
import { buildCardWhere } from "@/lib/cards/buildCardWhere";
import CardSearch from "@/components/browse/card-search";
import ActiveFilters from "@/components/browse/active-filters";

export default async function ChasePage({
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
          }}
        >
          My Chase Requests
        </h1>

        <AuthRequiredModal redirectUrl={"/requests"} />
      </main>
    );
  }

  const filters = await getCardFilters(searchParams);
  const hasFilters = Object.values(filters).some(Boolean);

  const chaseRequests = await prisma.chaseRequest.findMany({
    where: {
      wishlistItem: {
        user: {
          clerkId: userId,
        },
        card: buildCardWhere(filters),
      },
    },
    include: {
      wishlistItem: {
        include: {
          card: {
            include: {
              image: true,
              set: true,
              tcg: true,
            },
          },
        },
      },
      offers: true,
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
        My Chase Requests
      </h1>

      <div style={{ marginBottom: "10px", display: "flex", gap: 10 }}>
        <CardSearch basePath="requests" />
      </div>

      <ActiveFilters basePath="requests" />

      {hasFilters && chaseRequests.length > 0 && (
        <p
          style={{
            color: "#6b7280",
            margin: "5px 5px 10px",
          }}
        >
          Showing {chaseRequests.length} request
          {chaseRequests.length !== 1 ? "s" : ""}
        </p>
      )}

      <div>
        {chaseRequests.length === 0 ? (
          <p
            style={{
              color: "#6b7280",
              margin: "5px 5px 10px",
            }}
          >
            No chase requests found. Try adjusting your search or filters.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 220px)",
              gap: "24px",
              justifyContent: "start",
            }}
          >
            {chaseRequests.map((request) => {
              return (
                <CardDisplay
                  key={request.id}
                  card={request.wishlistItem.card}
                  context="requests"
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
