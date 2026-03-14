import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Garagen-Flohmarkt Zirndorf",
        short_name: "Flohmarkt",
        description:
          "Garagen-Flohmärkte in Zirndorf finden, entdecken und eigene Stände eintragen.",
        theme_color: "#0f6d4f",
        background_color: "#f6f3ea",
        display: "standalone",
        lang: "de",
        scope: basePath,
        start_url: basePath,
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,svg,png,webp}"],
      },
    }),
  ],
});
