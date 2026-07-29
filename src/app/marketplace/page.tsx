import AuthRequiredModal from "@/components/auth-required-modal";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function MarketplacePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          Open Chase Requests
        </h1>

        <AuthRequiredModal redirectUrl={"/marketplace"} />
      </main>
    );
  }

  const requests = await prisma.chaseItem.findMany({
    where: {
      status: "OPEN",
      user: {
        clerkId: {
          not: userId,
        },
      },
    },
    include: {
      card: true,
      user: true,
    },
  });

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "1024px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "24px",
        }}
      >
        Open Chase Requests
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {requests.map((request) => (
          <div
            key={request.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              {request.card.name}
            </h2>

            <p>Set: {request.card.setName}</p>

            <p>Rarity: {request.card.rarity}</p>

            <p
              style={{
                marginTop: "8px",
              }}
            >
              Wanted by: {request.user.displayName || request.user.username}
            </p>

            <Link
              href={`/marketplace/${request.id}`}
              className="hover:bg-gray-100 transition-colors"
              style={{
                display: "inline-block",
                marginTop: "16px",
                border: "1px solid #d1d5db",
                padding: "8px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Make Offer
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
