import { defineConfig, devices } from "@playwright/test";

/* Gate 15 reminder: Arabic-first RTL classroom QA; use accessible locators first, deterministic state assertions, and preserve canonical product flows. */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["json", { outputFile: "artifacts/playwright/results.json" }]],
  use: {
    baseURL,
    locale: "ar",
    timezoneId: "Asia/Riyadh",
    headless: true,
    actionTimeout: 8_000,
    navigationTimeout: 15_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
  ],
});
