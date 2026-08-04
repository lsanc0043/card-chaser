import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserCardState } from "@/lib/cards/getUserCardState";
import CardPageView from "@/components/cards/card-page-view";
import { getCard } from "@/lib/cards/getCard";
import { CardContext } from "@/lib/types";

export default async function CardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ context?: CardContext }>;
}) {
  const { context = "browse" } = await searchParams;
  const { id } = await params;
  const { userId } = await auth();

  const card = await getCard(id);

  if (!card) {
    notFound();
  }

  const { wishlistItem, collectionItems } = await getUserCardState(
    userId,
    card.id,
  );

  return (
    <main
      style={{
        padding: "10px 20px",
      }}
    >
      <CardPageView
        card={card}
        context={context}
        wishlistItem={wishlistItem}
        collectionItems={collectionItems}
      />
    </main>
  );
}
