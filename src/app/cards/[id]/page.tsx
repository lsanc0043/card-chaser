import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { addToChase } from "@/app/actions/chase";

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const card = await prisma.card.findUnique({
    where: {
      id,
    },
  });

  if (!card) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{card.name}</h1>

      <p>Set: {card.setName}</p>

      <p>Rarity: {card.rarity}</p>

      <form
        action={async () => {
          "use server";
          await addToChase(card.id);
        }}
      >
        <button className="mt-6 border px-4 py-2 rounded">
          Add to Chase List
        </button>
      </form>
    </main>
  );
}
