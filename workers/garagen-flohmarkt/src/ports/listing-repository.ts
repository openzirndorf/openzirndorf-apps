import type {
  CreateListingInput,
  Listing,
  ListListingsInput,
} from "@openzirndorf/garagen-flohmarkt-api";

type CreateListingRecord = CreateListingInput & {
  id: string;
  createdAt: number;
};

type ListingRepository = {
  list(filters?: ListListingsInput): Promise<Listing[]>;
  create(record: CreateListingRecord): Promise<Listing>;
};

export type { CreateListingRecord, ListingRepository };
