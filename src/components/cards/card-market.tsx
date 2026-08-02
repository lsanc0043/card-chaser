import TcgplayerButton from "../tcgplayer-button";

type CardMarketProps = {
  markets: {
    tcgplayer?: {
      url?: string;
      prices?: {
        low?: number | null;
        mid?: number | null;
        high?: number | null;
        market?: number | null;
      };
    };
  } | null;
};

export default function CardMarket({ markets }: CardMarketProps) {
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
          Market
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
              ["Low", markets?.tcgplayer?.prices?.low],
              ["Mid", markets?.tcgplayer?.prices?.mid],
              ["High", markets?.tcgplayer?.prices?.high],
              ["Market", markets?.tcgplayer?.prices?.market],
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
                  {value != null
                    ? `$${Number(value).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <TcgplayerButton url={markets?.tcgplayer?.url} />
        </div>
      </section>
    </div>
  );
}
