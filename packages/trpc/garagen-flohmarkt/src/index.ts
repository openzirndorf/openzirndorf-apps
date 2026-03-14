import { initTRPC } from "@trpc/server";
import { z } from "zod";

const listListingsInputSchema = z.object({
  neighborhood: z.string().min(1).optional(),
});

const createListingInputSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(500),
  neighborhood: z.string().min(2).max(120),
  saleDate: z.string().min(10).max(10),
});

type Listing = {
  id: string,
  title: string,
  description: string,
  neighborhood: string,
  saleDate: string,
};
type ListListingsInput = z.infer<typeof listListingsInputSchema>;
type CreateListingInput = z.infer<typeof createListingInputSchema>;

type GaragenFlohmarktContext = {
  requestId: string;
};

type GaragenFlohmarktService = {
  listListings(input?: ListListingsInput): Listing[] | Promise<Listing[]>;
  createListing(input: CreateListingInput): Listing | Promise<Listing>;
};

function createGaragenFlohmarktRouter(service: GaragenFlohmarktService) {
  const t = initTRPC.context<GaragenFlohmarktContext>().create();

  return t.router({
    listings: t.router({
      list: t.procedure
        .input(listListingsInputSchema.optional())
        .query(({ input }) => service.listListings(input)),
      create: t.procedure
        .input(createListingInputSchema)
        .mutation(({ input }) => service.createListing(input)),
    }),
  });
}

type AppRouter = ReturnType<typeof createGaragenFlohmarktRouter>;

export { createGaragenFlohmarktRouter };
export type {
  AppRouter,
  CreateListingInput,
  GaragenFlohmarktContext,
  GaragenFlohmarktService,
  Listing,
  ListListingsInput,
};