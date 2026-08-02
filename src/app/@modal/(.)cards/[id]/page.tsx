import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import CloseModalButton from "@/components/modals/close-modal-button";
import ModalWrapper from "@/components/modals/modal-wrapper";
import { getCard } from "@/lib/cards/getCard";
import { getUserCardState } from "@/lib/cards/getUserCardState";
import CardModalView from "@/components/cards/card-modal-view";
import { CardContext } from "@/lib/cards/types";

export default async function CardModal({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ context?: CardContext }>;
}) {
  const { context = "browse" } = await searchParams;
  const { userId } = await auth();
  const { id } = await params;

  const card = await getCard(id);

  console.log("card", card);

  if (!card) {
    notFound();
  }

  const { wishlistItem, collectionItem } = await getUserCardState(
    userId,
    card.id,
  );

  return (
    <ModalWrapper>
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: "16px",
          width: "900px",
          maxWidth: "1200px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "32px",
        }}
      >
        <CloseModalButton />

        <CardModalView
          card={card}
          context={context}
          wishlistItemId={wishlistItem?.id}
          collectionItemId={collectionItem?.id}
        />
      </div>
    </ModalWrapper>
  );
}
