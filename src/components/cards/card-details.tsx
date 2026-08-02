import { mapCardDetails } from "@/lib/cards/mapCardDetails";
import { CardWithDetails } from "@/lib/cards/types";

type CardDetailsProps = {
  card: CardWithDetails;
};

export default function CardDetails({ card }: CardDetailsProps) {
  const details = mapCardDetails(
    card.attributes as Record<string, string>,
    card.set?.releaseDate,
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
            borderBottom: "1px solid gray",
          }}
        >
          Card Details
        </h2>

        {details.sections.map((section, index) => (
          <section
            key={section.title || index}
            style={{
              marginTop: "12px",
            }}
          >
            {section.title && (
              <h3
                style={{
                  fontWeight: 700,
                  marginBottom: "8px",
                  borderBottom: "1px solid gray",
                }}
              >
                {section.title}
              </h3>
            )}

            {section.fields.map((field) => (
              <div key={field.label}>
                {field.html ? (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: `<strong>${field.label}</strong> ${field.value}`,
                    }}
                  />
                ) : (
                  <p>
                    {field.label && <strong>{field.label}: </strong>}
                    {field.value}
                  </p>
                )}
              </div>
            ))}
          </section>
        ))}
      </section>
    </div>
  );
}
