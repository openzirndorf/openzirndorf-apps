import { expect, test } from "@playwright/test";

const fakeBackendUrl =
  process.env.PLAYWRIGHT_FAKE_BACKEND_URL ?? "http://127.0.0.1:8788";

test.beforeEach(async ({ page, request }) => {
  const resetResponse = await request.post(`${fakeBackendUrl}/test/reset`);

  expect(resetResponse.ok()).toBeTruthy();

  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

test("loads the seeded listings", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Synchronisiert, 2 Einträge im Cache")).toBeVisible();
  await expect(page.getByText("Kinderkleidung und Roller")).toBeVisible();
  await expect(page.getByText("Werkbank-Fundstuecke")).toBeVisible();
});

test("creates a new listing through the fake tRPC backend", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByLabel("Titel").fill("Buecher und Brettspiele");
  await page.getByLabel("Stadtteil").fill("Bronnamberg");
  await page.getByLabel("Datum").fill("2026-04-12");
  await page
    .getByLabel("Beschreibung")
    .fill("Romane, Kinderbuecher und Brettspiele aus zwei Regalen.");

  await page.getByRole("button", { name: "Stand speichern" }).click();

  await expect(page.getByText("Buecher und Brettspiele")).toBeVisible();
  await expect(page.getByText("Synchronisiert, 3 Einträge im Cache")).toBeVisible();
  await expect(page.getByLabel("Titel")).toHaveValue("");
  await expect(page.getByLabel("Stadtteil")).toHaveValue("");
});
