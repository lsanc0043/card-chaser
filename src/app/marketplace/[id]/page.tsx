import prisma from "@/lib/prisma";
import OfferForm from "./offer-form";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const chaseItem = await prisma.chaseItem.findUnique({
    where: {
      id,
    },
    include: {
      card: true,
    },
  });

  if (!chaseItem) {
    return null;
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

      <p
        style={{
          marginTop: "16px",
          fontSize: "16px",
        }}
      >
        Card: {chaseItem.card.name}
      </p>

      <OfferForm chaseItemId={id} />
    </main>
  );
}
