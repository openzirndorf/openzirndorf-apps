import { registerSW } from "virtual:pwa-register";
import faviconUrl from "@openzirndorf/brand/favicons/favicon.svg";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

import "@openzirndorf/ui/styles.css";
import "./app.css";

const queryCacheKey = "garagen-flohmarkt-query-cache";
const oneDayInMs = 1000 * 60 * 60 * 24;
const isE2E = import.meta.env.VITE_E2E === "true";

const localStorageAsync = {
  getItem: async (key: string) => window.localStorage.getItem(key),
  removeItem: async (key: string) => window.localStorage.removeItem(key),
  setItem: async (key: string, value: string) =>
    window.localStorage.setItem(key, value),
};

const queryPersister = createAsyncStoragePersister({
  key: queryCacheKey,
  storage: localStorageAsync,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: oneDayInMs,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const favicon = document.querySelector<HTMLLinkElement>("#app-favicon");

if (favicon) {
  favicon.href = faviconUrl;
}

if (!isE2E) {
  registerSW({
    immediate: true,
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    {isE2E ? (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    ) : (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          maxAge: oneDayInMs,
          persister: queryPersister,
        }}
      >
        <App />
      </PersistQueryClientProvider>
    )}
  </StrictMode>,
);
