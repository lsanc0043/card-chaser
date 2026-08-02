import { WishlistItemWithRequest } from "@/lib/wishlist/types";
import { Edit } from "lucide-react";
import Link from "next/link";

export default function CardRequestDetails({
  cardId,
  wishlistItem,
}: {
  cardId: string;
  wishlistItem: WishlistItemWithRequest | null;
}) {
  return (
    <div
      style={{
        flex: 1,
        width: "500px",
      }}
    >
      <section>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "8px",
            borderBottom: "1px solid gray",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Request Details</span>

          <Link
            href={`/cards/${cardId}/request`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Edit />
          </Link>
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "16px",
            fontSize: "15px",
          }}
        >
          <tbody>
            {[
              ["Status", wishlistItem?.status],
              [
                "Created On",
                wishlistItem?.createdAt &&
                  new Date(wishlistItem?.createdAt).toLocaleDateString(),
              ],
              [
                "Price",
                wishlistItem?.chaseRequest?.useRange
                  ? `$${wishlistItem.chaseRequest.minPrice} - ${wishlistItem.chaseRequest.maxPrice}`
                  : `$${wishlistItem?.chaseRequest?.price}`,
              ],
              ["Conditions", wishlistItem?.chaseRequest?.conditions.join(", ")],
              ["Quantity", wishlistItem?.chaseRequest?.quantity],
              ["# of Offers", wishlistItem?.chaseRequest?.offers.length],
            ].map(([label, value]) => (
              <tr key={label as string}>
                <td
                  style={{
                    padding: "8px 12px",
                    fontWeight: 600,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {label}
                </td>

                <td
                  style={{
                    padding: "8px 12px",
                    textAlign: "right",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {value != null ? value : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
