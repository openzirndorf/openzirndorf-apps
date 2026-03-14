import { useQuery } from "@tanstack/react-query";
import { listingsQueryOptions } from "../lib/query";

export function useListingsQuery() {
  return useQuery(listingsQueryOptions());
}
