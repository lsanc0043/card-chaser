import prisma from "@/lib/prisma";
import OfferForm from "./offer-form";
import { notFound } from "next/navigation";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await prisma.chaseRequest.findUnique({
    where: {
      id,
    },
    include: {
      chaseItem: {
        include: {
          card: true,
          user: true,
        },
      },
    },
  });

  if (!request) {
    notFound();
  }

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "640px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        Make Offer
      </h1>

      <p>Card: {request.chaseItem.card.name}</p>

      <p>Requested by: {request.chaseItem.user.username}</p>

      <OfferForm
        chaseRequestId={request.id}
        minPrice={
          request.useRange
            ? request.minPrice?.toNumber()
            : request.price?.toNumber()
        }
        maxPrice={
          request.useRange
            ? request.maxPrice?.toNumber()
            : request.price?.toNumber()
        }
        allowedConditions={request.conditions}
      />
    </main>
  );
}
