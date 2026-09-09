import { defineConfig, devices } from "playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30000,
  fullyParallel: true,
  // Keep media tests predictable on a shared development machine.
  workers: 1,
  globalTimeout: 300000,
  reporter: [
    ["list"],
    ["html", { outputFolder: "output/playwright/e2e/report", open: "never" }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:4317",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  outputDir: "output/playwright/e2e/results",
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chromium",
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        defaultBrowserType: "chromium",
        channel: "chromium",
      },
    },
    { name: "webkit-mobile", use: { ...devices["iPhone 13"] } },
    ...(process.env.E2E_FIREFOX === "1"
      ? [
          {
            name: "firefox",
            use: {
              ...devices["Desktop Firefox"],
              viewport: { width: 1440, height: 1000 },
            },
          },
        ]
      : []),
  ],
});
