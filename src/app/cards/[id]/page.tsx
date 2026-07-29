import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { addToChase } from "@/app/actions/chase";
import { auth } from "@clerk/nextjs/server";
import AddToChaseButton from "@/components/add-to-chase-button";

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
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
    <main
      style={{
        padding: "32px",
        maxWidth: "800px",
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
        {card.name}
      </h1>

      <p>Set: {card.setName}</p>

      <p>Rarity: {card.rarity}</p>

      <AddToChaseButton
        userId={userId}
        cardId={card.id}
        action={async () => {
          "use server";

          await addToChase(card.id, `/cards/${card.id}`);
        }}
      />
    </main>
  );
}
