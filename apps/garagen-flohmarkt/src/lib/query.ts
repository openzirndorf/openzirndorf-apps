import { queryOptions } from "@tanstack/react-query";
import { fetchListings } from "./trpc";

export const listingQueryKey = ["garagen-flohmarkt", "listings"] as const;

export function listingsQueryOptions() {
  return queryOptions({
    queryKey: listingQueryKey,
    queryFn: fetchListings,
  });
}
