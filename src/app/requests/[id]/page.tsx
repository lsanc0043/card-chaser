import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { formatConditions } from "@/lib/utils";

export default async function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: requestId } = await params;

  const { userId } = await auth();

  if (!userId) {
    return (
      <main style={{ padding: "20px" }}>
        <p>You must be signed in.</p>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return null;
  }

  const request = await prisma.chaseRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      offers: true,
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
    },
  });

  if (!request) {
    return (
      <main style={{ padding: "20px" }}>
        <p>Request not found.</p>
      </main>
    );
  }

  // ownership check
  if (request.wishlistItem.userId !== user.id) {
    return (
      <main style={{ padding: "20px" }}>
        <p>Unauthorized.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "20px",
      }}
    >
      <Link
        href={`/cards/${request.wishlistItem.card.id}/requests`}
        style={{
          color: "#2563eb",
        }}
      >
        ← Back to Requests
      </Link>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginTop: "20px",
        }}
      >
        {request.wishlistItem.card.name}
      </h1>

      <p
        style={{
          color: "#6b7280",
        }}
      >
        {request.wishlistItem.card.tcg.name} •{" "}
        {request.wishlistItem.card.set.name}
      </p>

      <section
        style={{
          marginTop: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          Request Details
        </h2>

        <p>
          Price:{" "}
          {request.useRange
            ? `$${request.minPrice} - $${request.maxPrice}`
            : `$${request.price}`}
        </p>

        <p>Conditions: {formatConditions(request.conditions)}</p>

        <p>Quantity: {request.quantity}</p>

        <p>Status: {request.status}</p>
      </section>

      <section
        style={{
          marginTop: "30px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          Offers ({request.offers.length})
        </h2>

        {request.offers.length === 0 ? (
          <p>No offers yet.</p>
        ) : (
          request.offers.map((offer) => (
            <div
              key={offer.id}
              style={{
                border: "1px solid #e5e7eb",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "10px",
              }}
            >
              <p>Price: ${offer.price.toString()}</p>

              <p>Condition: {offer.condition}</p>

              <p>Quantity: {offer.quantity}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
