import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/playwright",
  fullyParallel: true,
  // projects: [
  //   { name: "chromium", use: { browserName: "chromium" } },
  //   { name: "firefox", use: { browserName: "firefox" } },
  //   { name: "webkit", use: { browserName: "webkit" } }
  // ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});
