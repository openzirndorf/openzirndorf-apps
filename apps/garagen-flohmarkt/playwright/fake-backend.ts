import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import {
  type CreateHTTPContextOptions,
  createHTTPHandler,
} from "@trpc/server/adapters/standalone";
import {
  type CreateListingInput,
  createGaragenFlohmarktRouter,
  type GaragenFlohmarktService,
  type Listing,
  type ListListingsInput,
} from "../../../packages/trpc/garagen-flohmarkt/src/index";

const host = "127.0.0.1";
const port = Number(process.env.PLAYWRIGHT_FAKE_BACKEND_PORT ?? 8788);

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-request-id, x-trpc-source",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

const seededListings: Listing[] = [
  {
    id: "listing-seed-1",
    title: "Kinderkleidung und Roller",
    description:
      "Gut erhaltende Kinderkleidung, Roller und ein paar Spiele aus der Garage.",
    neighborhood: "Zirndorf Nord",
    saleDate: "2026-04-12",
  },
  {
    id: "listing-seed-2",
    title: "Werkbank-Fundstuecke",
    description:
      "Werkzeug, Lampen und kleine Haushaltsfunde fuer den Flohmarkt am Samstag.",
    neighborhood: "Weiherhof",
    saleDate: "2026-04-12",
  },
];

let listings = cloneListings(seededListings);

function cloneListings(source: Listing[]) {
  return source.map((listing) => ({ ...listing }));
}

function resetListings() {
  listings = cloneListings(seededListings);
  return listings;
}

function filterListings(input?: ListListingsInput) {
  const neighborhood = input?.neighborhood?.trim().toLowerCase();

  if (!neighborhood) {
    return cloneListings(listings);
  }

  return cloneListings(
    listings.filter((listing) =>
      listing.neighborhood.toLowerCase().includes(neighborhood),
    ),
  );
}

const service: GaragenFlohmarktService = {
  listListings(input) {
    return filterListings(input);
  },
  createListing(input: CreateListingInput) {
    const listing: Listing = {
      id: randomUUID(),
      title: input.title.trim(),
      description: input.description.trim(),
      neighborhood: input.neighborhood.trim(),
      saleDate: input.saleDate,
    };

    listings = [listing, ...listings];
    return listing;
  },
};

const handler = createHTTPHandler({
  createContext({ req }: CreateHTTPContextOptions) {
    const requestIdHeader = req.headers["x-request-id"];
    const requestId = Array.isArray(requestIdHeader)
      ? requestIdHeader[0]
      : requestIdHeader;

    return {
      requestId: requestId ?? randomUUID(),
    };
  },
  onError({ error, path }: { error: Error; path?: string }) {
    console.error("Fake tRPC request failed", {
      message: error.message,
      path,
    });
  },
  router: createGaragenFlohmarktRouter(service),
});

function setCorsHeaders(response: import("node:http").ServerResponse) {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.setHeader(key, value);
  }
}

function writeJson(
  response: import("node:http").ServerResponse,
  statusCode: number,
  payload: unknown,
) {
  setCorsHeaders(response);
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  const url = new URL(request.url ?? "/", `http://${host}:${port}`);

  if (url.pathname === "/health") {
    writeJson(response, 200, {
      listings: listings.length,
      ok: true,
      service: "garagen-flohmarkt-playwright-backend",
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/test/reset") {
    writeJson(response, 200, {
      listings: resetListings(),
      ok: true,
    });
    return;
  }

  if (!url.pathname.startsWith("/trpc")) {
    writeJson(response, 404, {
      message: "Not found",
    });
    return;
  }

  request.url = `${url.pathname.replace(/^\/trpc/, "") || "/"}${url.search}`;
  handler(request, response);
});

server.listen(port, host, () => {
  console.log(
    `Garagen-Flohmarkt fake backend listening on http://${host}:${port}`,
  );
});
