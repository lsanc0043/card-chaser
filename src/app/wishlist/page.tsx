import ActiveFilters from "@/components/browse/active-filters";
import CardSearch from "@/components/browse/card-search";
import CardDisplay from "@/components/cards/card-display";
import { buildCardWhere } from "@/lib/cards/buildCardWhere";
import { getCardFilters } from "@/lib/cards/getCardFilters";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function WishlistPage({
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

  const wishlistItems = await prisma.wishlistItem.findMany({
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
      chaseRequest: {
        include: {
          offers: true,
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
        My Wishlist
      </h1>

      <div style={{ marginBottom: "10px", display: "flex", gap: 10 }}>
        <CardSearch basePath="wishlist" />
      </div>

      <ActiveFilters basePath="wishlist" />

      {hasFilters && wishlistItems.length > 0 && (
        <p
          style={{
            color: "#6b7280",
            margin: "5px 5px 10px",
          }}
        >
          Showing {wishlistItems.length} card
          {wishlistItems.length !== 1 ? "s" : ""}
        </p>
      )}

      <div>
        {wishlistItems.length === 0 ? (
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
              gridTemplateColumns: "repeat(auto-fill, 220px)",
              gap: "24px",
              justifyContent: "start",
            }}
          >
            {wishlistItems.map((item) => (
              <CardDisplay key={item.id} card={item.card} context="wishlist" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
