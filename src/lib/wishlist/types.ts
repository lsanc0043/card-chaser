import { Prisma } from "@prisma/client";

export type WishlistItemWithRequest = Prisma.WishlistItemGetPayload<{
  include: {
    chaseRequest: {
      include: {
        offers: true;
      };
    };
  };
}>;
