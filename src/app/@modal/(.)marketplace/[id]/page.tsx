import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ModalWrapper from "@/components/modals/modal-wrapper";
import CloseModalButton from "@/components/modals/close-modal-button";
import OfferForm from "@/app/marketplace/[id]/offer-form";
import Image from "next/image";

export default async function OfferModal({
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
      wishlistItem: {
        include: {
          card: {
            include: {
              set: true,
              image: true,
            },
          },
          user: true,
        },
      },
      offers: true,
    },
  });

  if (!request) {
    notFound();
  }

  const attributes = request.wishlistItem.card.attributes as Record<
    string,
    string
  >;

  const existingOffer = request.offers[0];

  return (
    <ModalWrapper>
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          width: "1200px",
          maxWidth: "90vw",
          maxHeight: "90vh",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <CloseModalButton />

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          {`${existingOffer ? "Edit" : "Make"} Offer`}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "flex-start",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              position: "sticky",
              top: 0,
            }}
          >
            {request.wishlistItem.card.image?.medium && (
              <Image
                src={request.wishlistItem.card.image.medium}
                alt={request.wishlistItem.card.name}
                width={320}
                height={448}
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                }}
              />
            )}
            <section>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                {request.wishlistItem.card.name}
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  fontSize: "15px",
                  marginBottom: "24px",
                }}
              >
                {request.wishlistItem.card.set?.name} •{" "}
                {attributes.Rarity ?? "Unknown"}
              </p>
            </section>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              //   overflowY: "auto",
              maxHeight: "70vh",
              paddingRight: "16px",
            }}
          >
            <section>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {`Buyer's Request`}
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  rowGap: "12px",
                  columnGap: "16px",
                  fontSize: "15px",
                }}
              >
                <div style={{ color: "#6b7280" }}>Buyer</div>
                <div>
                  {request.wishlistItem.user.displayName ??
                    request.wishlistItem.user.username}
                </div>

                <div style={{ color: "#6b7280" }}>Price</div>
                <div style={{ fontWeight: 600 }}>
                  {request.useRange
                    ? `$${request.minPrice} – $${request.maxPrice}`
                    : `$${request.price}`}
                </div>

                <div style={{ color: "#6b7280" }}>Conditions</div>
                <div>{request.conditions.join(", ")}</div>

                <div style={{ color: "#6b7280" }}>Quantity</div>
                <div>{request.quantity}</div>

                <div style={{ color: "#6b7280" }}>Posted</div>
                <div>{new Date(request.createdAt).toLocaleDateString()}</div>
              </div>
            </section>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              overflowY: "auto",
              maxHeight: "70vh",
              paddingLeft: "24px",
              borderLeft: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Your Offer
            </h2>

            <OfferForm
              chaseRequestId={request.id}
              minPrice={request.useRange ? request.minPrice?.toNumber() : 0}
              maxPrice={
                request.useRange
                  ? request.maxPrice?.toNumber()
                  : request.price?.toNumber()
              }
              allowedConditions={request.conditions}
              initialOffer={
                existingOffer
                  ? {
                      price: existingOffer.price.toString(),
                      condition: existingOffer.condition,
                      message: existingOffer.message ?? null,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
