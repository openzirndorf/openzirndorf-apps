import type {
  AppRouter,
  CreateListingInput,
} from "@openzirndorf/garagen-flohmarkt-api";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

const fallbackUrl = "http://127.0.0.1:8787/trpc";

function resolveTrpcUrl() {
  return import.meta.env.VITE_TRPC_URL ?? fallbackUrl;
}

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: resolveTrpcUrl(),
    }),
  ],
});

export async function fetchListings() {
  return trpcClient.listings.list.query();
}

export async function createListing(input: CreateListingInput) {
  return trpcClient.listings.create.mutate(input);
}
