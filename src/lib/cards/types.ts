import { Prisma } from "@prisma/client";

export type CardWithDetails = Prisma.CardGetPayload<{
  include: {
    set: true;
    tcg: true;
    image: true;
  };
}>;

export type CardContext = "browse" | "collection" | "wishlist" | "requests";
