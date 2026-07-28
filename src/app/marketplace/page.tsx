import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function MarketplacePage() {
  const requests = await prisma.chaseItem.findMany({
    where: {
      status: "OPEN",
    },
    include: {
      card: true,
      user: true,
    },
  });

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Open Chase Requests</h1>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="border rounded-lg p-5">
            <h2 className="text-xl font-semibold">{request.card.name}</h2>

            <p>Set: {request.card.setName}</p>

            <p>Rarity: {request.card.rarity}</p>

            <p className="mt-2">Wanted by: {request.user.username}</p>

            <Link
              href={`/marketplace/${request.id}`}
              className="inline-block mt-4 border px-4 py-2 rounded"
            >
              Make Offer
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
