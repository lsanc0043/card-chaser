import { SerializedWishlistItemWithRequests } from "@/lib/types";
import ViewRequestsButton from "./wishlist-view-requests-button";

export default function CardWishlistDetails({
  wishlistItem,
}: {
  wishlistItem?: SerializedWishlistItemWithRequests | null;
}) {
  if (!wishlistItem) {
    return (
      <div
        style={{
          color: "#6b7280",
        }}
      >
        This card is not currently on your wishlist.
      </div>
    );
  }

  const openRequests = wishlistItem.chaseRequests.filter(
    (request) => request.status === "OPEN",
  );

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
      }}
    >
      <section>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "8px",
            borderBottom: "1px solid gray",
          }}
        >
          Wishlist Details
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
            <tr>
              <td style={labelStyle}>Status</td>
              <td style={{ ...valueStyle, textAlign: "right" }}>
                {wishlistItem.status}
              </td>
            </tr>

            <tr>
              <td style={labelStyle}>Added</td>
              <td style={{ ...valueStyle, textAlign: "right" }}>
                {new Date(wishlistItem.createdAt).toLocaleDateString()}
              </td>
            </tr>

            <tr>
              <td style={labelStyle}>Open Requests</td>
              <td
                style={{
                  ...valueStyle,
                  textAlign: "right",
                }}
              >
                <ViewRequestsButton
                  cardId={wishlistItem.cardId}
                  total={openRequests.length}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

const labelStyle = {
  padding: "8px 12px",
  fontWeight: 600,
  borderBottom: "1px solid #e5e7eb",
};

const valueStyle = {
  padding: "8px 12px",
  fontWeight: 400,
  borderBottom: "1px solid #e5e7eb",
};
