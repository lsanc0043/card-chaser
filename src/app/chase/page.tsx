import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import AuthRequiredModal from "@/components/auth-required-modal";
import CardDisplay from "@/components/card-display";

export default async function ChasePage() {
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
          My Chase List
        </h1>

        <AuthRequiredModal redirectUrl={"/chase"} />
      </main>
    );
  }

  const chaseItems = await prisma.chaseItem.findMany({
    where: {
      user: {
        clerkId: userId,
      },
    },
    include: {
      card: {
        include: {
          set: true,
          image: true,
        },
      },
      offers: {
        include: {
          seller: true,
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
        My Chase List
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 220px)",
          gap: "24px",
          justifyContent: "start",
        }}
      >
        {chaseItems.map((item) => {
          return (
            <CardDisplay
              card={item.card}
              showRemoveChase={true}
              chaseItemId={item.id}
              key={item.id}
            />
          );
        })}
      </div>
    </main>
  );
}
