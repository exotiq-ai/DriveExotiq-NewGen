import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  fullyParallel: true,
  workers: 3,
  reporter: [['list'], ['html', { outputFolder: '../evidence/browser/report', open: 'never' }]],
  use: { baseURL: process.env.ASTRA_TEST_URL || 'http://127.0.0.1:4317', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  outputDir: '../evidence/browser/results',
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', channel: 'chrome' } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 13'] } },
    ...(process.env.ASTRA_FIREFOX === '1' ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 1000 } } }] : []),
  ],
});
