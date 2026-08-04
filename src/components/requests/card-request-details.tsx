import { SerializedWishlistItemWithRequests } from "@/lib/types";
import { formatConditions } from "@/lib/utils";
import { Edit, Plus } from "lucide-react";
import Link from "next/link";

export default function CardWishlistDetails({
  cardId,
  wishlistItem,
}: {
  cardId: string;
  wishlistItem: SerializedWishlistItemWithRequests | null;
}) {
  if (!wishlistItem) {
    return (
      <div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          Wishlist
        </h2>

        <p>No wishlist entry.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "500px",
      }}
    >
      <section>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            borderBottom: "1px solid gray",
            paddingBottom: "8px",
          }}
        >
          Wishlist Details
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "12px",
          }}
        >
          <tbody>
            {[
              ["Status", wishlistItem.status],
              [
                "Created",
                new Date(wishlistItem.createdAt).toLocaleDateString(),
              ],
            ].map(([label, value]) => (
              <tr key={label}>
                <td
                  style={{
                    padding: "8px",
                    fontWeight: 600,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {label}
                </td>

                <td
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section
        style={{
          marginTop: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            Requests
          </h2>

          <Link href={`/cards/${cardId}/request`}>
            <Plus />
          </Link>
        </div>

        {wishlistItem.chaseRequests.length === 0 ? (
          <p>No active requests.</p>
        ) : (
          wishlistItem.chaseRequests.map((request) => (
            <div
              key={request.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "16px",
                marginTop: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>Request</strong>

                <Link href={`/cards/${cardId}/request/${request.id}`}>
                  <Edit size={18} />
                </Link>
              </div>

              <p>
                Price:{" "}
                <strong>
                  {request.useRange
                    ? `$${request.minPrice} - $${request.maxPrice}`
                    : `$${request.price}`}
                </strong>
              </p>

              <p>Conditions: {formatConditions(request.conditions)}</p>

              <p>Quantity: {request.quantity}</p>

              <p>Offers: {request.offers.length}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
