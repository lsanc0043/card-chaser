import AuthRequiredModal from "@/components/auth-required-modal";
import CardDisplay from "@/components/card-display";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
      card: {
        include: {
          set: true,
          image: true,
        },
      },
      user: true,
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 220px)",
          gap: "24px",
          justifyContent: "start",
        }}
      >
        {requests.map((request) => {
          return (
            <CardDisplay
              card={request.card}
              isMarketplaceCard={true}
              wantedByUserId={request.user.username}
              requestId={request.id}
              key={request.id}
            />
          );
        })}
      </div>
    </main>
  );
}
