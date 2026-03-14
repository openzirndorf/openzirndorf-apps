import {
  createGaragenFlohmarktRouter,
  type GaragenFlohmarktService,
} from "@openzirndorf/garagen-flohmarkt-api";

export function createAppRouter(service: GaragenFlohmarktService) {
  return createGaragenFlohmarktRouter({
    listListings(input) {
      return service.listListings(input);
    },
    createListing(input) {
      return service.createListing(input);
    },
  });
}
