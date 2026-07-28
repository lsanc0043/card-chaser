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
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Make Offer</h1>

      <p className="mt-4">Card: {chaseItem.card.name}</p>

      <OfferForm chaseItemId={id} />
    </main>
  );
}
