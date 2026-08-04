import { CollectionItem, Prisma } from "@prisma/client";

export type CardWithDetails = Prisma.CardGetPayload<{
  include: {
    set: true;
    tcg: true;
    image: true;
  };
}>;

export type CardContext = "browse" | "collection" | "wishlist" | "requests";

export type UserCollectionItem = Prisma.CollectionItemGetPayload<object>;

export type CollectionItemWithCard = Prisma.CollectionItemGetPayload<{
  include: {
    card: {
      include: {
        set: true;
        tcg: true;
        image: true;
      };
    };
  };
}>;

export type CollectionCard = {
  card: CardWithDetails;
  collectionItems: CollectionItem[];
};

export type UserChaseRequest = Prisma.ChaseRequestGetPayload<{
  include: {
    offers: true;
    wishlistItem: {
      include: {
        card: {
          include: {
            image: true;
            set: true;
            tcg: true;
          };
        };
      };
    };
  };
}>;

export type MarketplaceChaseRequest = Prisma.ChaseRequestGetPayload<{
  include: {
    offers: true;
    wishlistItem: {
      include: {
        user: true;
        card: {
          include: {
            image: true;
            set: true;
            tcg: true;
          };
        };
      };
    };
  };
}>;

export type SerializedOffer = {
  id: string;
  price: number;
  quantity: number;
  condition: string;
  status: string;
  sellerId: string;
  message: string | null;
  createdAt: Date;
  chaseRequestId: string;
};

export type SerializedUserChaseRequest = Omit<
  UserChaseRequest,
  "price" | "minPrice" | "maxPrice" | "offers"
> & {
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  offers: SerializedOffer[];
};

export type SerializedMarketplaceChaseRequest = Omit<
  MarketplaceChaseRequest,
  "price" | "minPrice" | "maxPrice" | "offers"
> & {
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  offers: SerializedOffer[];
};

export type WishlistItemWithRequests = Prisma.WishlistItemGetPayload<{
  include: {
    chaseRequests: {
      include: {
        offers: true;
      };
    };
  };
}>;

export type SerializedWishlistItemWithRequests = Omit<
  WishlistItemWithRequests,
  "chaseRequests"
> & {
  chaseRequests: SerializedUserChaseRequest[];
};

export type UserCardState = {
  collectionItems: UserCollectionItem[];
  wishlistItem: SerializedWishlistItemWithRequests | null;
};

export type CollectionQuantities = {
  "Near Mint": number;
  "Lightly Played": number;
  "Moderately Played": number;
  "Heavily Played": number;
  Damaged: number;
};

export type CardMarkets = {
  tcgplayer?: {
    url?: string;
    prices?: {
      low?: number | null;
      mid?: number | null;
      high?: number | null;
      market?: number | null;
    };
  };
};
