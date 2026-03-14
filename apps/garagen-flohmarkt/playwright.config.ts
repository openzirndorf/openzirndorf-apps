import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const appPort = 4173;
const fakeBackendPort = 8788;
const appUrl = `http://127.0.0.1:${appPort}`;
const fakeBackendUrl = `http://127.0.0.1:${fakeBackendPort}`;
const appDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: appUrl,
    serviceWorkers: "block",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: [
    {
      command: "corepack pnpm exec tsx ./playwright/fake-backend.ts",
      cwd: appDirectory,
      env: {
        ...process.env,
        PLAYWRIGHT_FAKE_BACKEND_PORT: String(fakeBackendPort),
      },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      url: `${fakeBackendUrl}/health`,
    },
    {
      command: `corepack pnpm dev --host 127.0.0.1 --port ${appPort} --strictPort`,
      cwd: appDirectory,
      env: {
        ...process.env,
        VITE_E2E: "true",
        VITE_TRPC_URL: `${fakeBackendUrl}/trpc`,
      },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      url: appUrl,
    },
  ],
});
