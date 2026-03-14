import type {
  CreateListingInput,
  GaragenFlohmarktService,
  ListListingsInput,
} from "@openzirndorf/garagen-flohmarkt-api";
import type { ListingRepository } from "../ports/listing-repository";

function normalizeInput(input: CreateListingInput): CreateListingInput {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    neighborhood: input.neighborhood.trim(),
    saleDate: input.saleDate,
  };
}

export function createListingService(
  repository: ListingRepository,
): GaragenFlohmarktService {
  return {
    async listListings(input?: ListListingsInput) {
      const neighborhood = input?.neighborhood?.trim();

      return repository.list(neighborhood ? { neighborhood } : undefined);
    },
    async createListing(input: CreateListingInput) {
      const normalizedInput = normalizeInput(input);

      return repository.create({
        ...normalizedInput,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
    },
  };
}
