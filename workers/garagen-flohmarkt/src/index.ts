import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createDrizzleListingRepository } from "./adapters/drizzle/drizzle-listing-repository";
import { createAppRouter } from "./router";
import { createListingService } from "./services/listing-service";

type Env = {
  DB: D1Database;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-trpc-source",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

function withCors(response: Response) {
  const nextHeaders = new Headers(response.headers);

  for (const [key, value] of Object.entries(corsHeaders)) {
    nextHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: nextHeaders,
  });
}

const worker: ExportedHandler<Env> = {
  fetch(request, env) {
    const url = new URL(request.url);
    const listingRepository = createDrizzleListingRepository(env.DB);
    const listingService = createListingService(listingRepository);
    const appRouter = createAppRouter(listingService);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      return Response.json(
        { ok: true, service: "garagen-flohmarkt-worker" },
        { headers: corsHeaders },
      );
    }

    const response = fetchRequestHandler({
      endpoint: "/trpc",
      req: request,
      router: appRouter,
      createContext: () => ({
        requestId: request.headers.get("cf-ray") ?? crypto.randomUUID(),
      }),
      onError({ error, path }) {
        console.error("tRPC request failed", {
          path,
          message: error.message,
        });
      },
    });

    return response.then(withCors);
  },
};

export default worker;
