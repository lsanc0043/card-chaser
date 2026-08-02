import ActiveFilters from "@/components/cards/active-filters";
import CardSearch from "@/components/cards/card-search";
import CollectionCard from "@/components/collection/collection-card";
import { buildCardWhere } from "@/lib/cards/buildCardWhere";
import { getCardFilters } from "@/lib/cards/getCardFilters";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CollectionPage({
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
    redirect("/sign-in");
  }

  const filters = await getCardFilters(searchParams);
  const hasFilters = Object.values(filters).some(Boolean);

  const collectionItems =
    userId &&
    (await prisma.collectionItem.findMany({
      where: {
        user: {
          clerkId: userId,
        },
        card: buildCardWhere(filters),
      },
      include: {
        card: {
          include: {
            image: true,
            set: true,
            tcg: true,
          },
        },
      },
    }));

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
        My Collection
      </h1>

      <div style={{ marginBottom: "10px", display: "flex", gap: 10 }}>
        <CardSearch basePath="collection" />
      </div>

      <ActiveFilters basePath="collection" />

      {hasFilters && collectionItems.length > 0 && (
        <p
          style={{
            color: "#6b7280",
            margin: "5px 5px 10px",
          }}
        >
          Showing {collectionItems.length} card
          {collectionItems.length !== 1 ? "s" : ""}
        </p>
      )}

      <div>
        {collectionItems.length === 0 ? (
          <p
            style={{
              color: "#6b7280",
              margin: "5px 5px 10px",
            }}
          >
            No cards found. Try adjusting your search or filters.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 280px)",
              gap: "24px",
            }}
          >
            {(collectionItems || []).map((item) => {
              const attributes = item.card.attributes as Record<string, string>;
              return (
                <CollectionCard
                  key={item.id}
                  item={{
                    ...item,
                    purchasePrice: item.purchasePrice?.toString() ?? null,
                    card: {
                      ...item.card,
                      attributes: {
                        Rarity: attributes.Rarity ?? null,
                      },
                    },
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
