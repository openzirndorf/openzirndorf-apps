/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_E2E?: "true" | "false";
  readonly VITE_TRPC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
