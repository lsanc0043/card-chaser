import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ModalWrapper from "@/components/modal-wrapper";
import CloseModalButton from "@/components/close-modal-button";
import RequestForm from "@/components/request-form";
import { auth } from "@clerk/nextjs/server";

export default async function RequestModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    notFound();
  }

  const card = await prisma.card.findUnique({
    where: {
      id,
    },
    include: {
      set: true,
      image: true,
    },
  });

  if (!card) {
    notFound();
  }

  const chaseItem = await prisma.chaseItem.findUnique({
    where: {
      userId_cardId: {
        userId: user.id,
        cardId: card.id,
      },
    },
    include: {
      request: true,
    },
  });

  const request = chaseItem?.request;

  const attributes = card.attributes as Record<string, string>;
  const mode = request ? "edit" : "create";

  return (
    <ModalWrapper>
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          padding: "32px",
        }}
      >
        <CloseModalButton />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {card.name}
          </h1>

          {card.set?.name && (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {card.set?.name}
            </span>
          )}

          {attributes.Rarity && (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {attributes.Rarity}
            </span>
          )}
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          {`${mode === "edit" ? "Edit" : "Create"} Chase Request`}
        </h1>
        <RequestForm
          cardId={card.id}
          requestId={request?.id}
          mode={mode}
          initialValues={
            request
              ? {
                  price: request?.price?.toString(),
                  useRange: request?.useRange ?? false,
                  minPrice: request?.minPrice?.toString(),
                  maxPrice: request?.maxPrice?.toString(),
                  conditions: request?.conditions ?? [],
                  quantity: request?.quantity ?? 1,
                }
              : undefined
          }
        />
      </div>
    </ModalWrapper>
  );
}
