import type {
  CreateListingInput,
  Listing,
} from "@openzirndorf/garagen-flohmarkt-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listingQueryKey } from "../lib/query";
import { createListing } from "../lib/trpc";

export function useCreateListingMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListingInput) => createListing(input),
    onSuccess(nextEntry) {
      queryClient.setQueryData<Listing[]>(
        listingQueryKey,
        (currentEntries = []) => [nextEntry, ...currentEntries],
      );
      options?.onSuccess?.();
    },
  });
}
