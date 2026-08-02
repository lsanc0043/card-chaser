type CardDetails = {
  common: {
    number?: string;
    rarity?: string;
    releaseDate?: Date;
  };

  sections: {
    title?: string;
    fields: {
      label: string;
      value: string;
      html?: boolean;
    }[];
  }[];
};

export function mapCardDetails(
  attributes: Record<string, string>,
  releaseDate?: Date | null,
): CardDetails {
  const common = {
    number: attributes.Number,
    rarity: attributes.Rarity,
    releaseDate: releaseDate ?? undefined,
  };

  if (attributes["Card Type"] || attributes.HP || attributes.Stage) {
    return {
      common,
      sections: [
        {
          fields: [
            {
              label: "Card Type",
              value: attributes["Card Type"] ?? "",
            },
            {
              label: "HP",
              value: attributes.HP ?? "",
            },
            {
              label: "Stage",
              value: attributes.Stage ?? "",
            },
          ].filter((x) => x.value),
        },
        {
          title: "Battle",
          fields: [
            {
              label: "Attack 1",
              value: attributes["Attack 1"] ?? "",
              html: true,
            },
            {
              label: "Weakness",
              value: attributes.Weakness ?? "",
            },
            {
              label: "Resistance",
              value: attributes.Resistance ?? "",
            },
            {
              label: "Retreat Cost",
              value: attributes.RetreatCost ?? "",
            },
          ].filter((x) => x.value),
        },
        {
          title: "Card Text",
          fields: attributes.CardText
            ? [
                {
                  label: "",
                  value: attributes.CardText,
                  html: true,
                },
              ]
            : [],
        },
      ],
    };
  }

  // One Piece
  if (attributes.CardType || attributes.Power || attributes.Color) {
    return {
      common,
      sections: [
        {
          title: "One Piece",
          fields: [
            {
              label: "Card Type",
              value: attributes.CardType ?? "",
            },
            {
              label: "Color",
              value: attributes.Color ?? "",
            },
            {
              label: "Cost",
              value: attributes.Cost ?? "",
            },
            {
              label: "Power",
              value: attributes.Power ?? "",
            },
            {
              label: "Attribute",
              value: attributes.Attribute ?? "",
            },
            {
              label: "Subtype",
              value: attributes.Subtypes ?? "",
            },
            {
              label: "Artist",
              value: attributes.Artist ?? "",
            },
          ].filter((x) => x.value),
        },
        {
          title: "Card Text",
          fields: attributes.Description
            ? [
                {
                  label: "",
                  value: attributes.Description,
                  html: true,
                },
              ]
            : [],
        },
      ],
    };
  }

  // fallback for future TCGs
  return {
    common,
    sections: [
      {
        title: "Details",
        fields: Object.entries(attributes).map(([label, value]) => ({
          label,
          value,
        })),
      },
    ],
  };
}
