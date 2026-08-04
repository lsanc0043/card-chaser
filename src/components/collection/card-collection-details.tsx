import { CONDITIONS } from "@/lib/cards/constants";
import { UserCollectionItem } from "@/lib/types";

export default function CardCollectionDetails({
  collectionItems,
}: {
  collectionItems: UserCollectionItem[];
}) {
  const sortedItems = [...collectionItems].sort(
    (a, b) => CONDITIONS.indexOf(a.condition) - CONDITIONS.indexOf(b.condition),
  );

  const total = sortedItems.reduce((sum, item) => sum + item.quantity, 0);

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
          Collection Details
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
            {[...sortedItems, { condition: "Total", quantity: total }].map(
              (item) => {
                const isTotal = item.condition === "Total";

                return (
                  <tr key={item.condition}>
                    <td
                      style={{
                        padding: "8px 12px",
                        fontWeight: isTotal ? 700 : 600,
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor: isTotal ? "#f3f4f6" : "transparent",
                      }}
                    >
                      {item.condition}
                    </td>

                    <td
                      style={{
                        padding: "8px 12px",
                        textAlign: "right",
                        fontWeight: isTotal ? 700 : 400,
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor: isTotal ? "#f3f4f6" : "transparent",
                      }}
                    >
                      {item.quantity}
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
