import { test, expect } from "playwright/test";

test("public navigation makes no PostHog requests before analytics consent", async ({ page }) => {
  const requests: string[] = [];
  await page.addInitScript(() => localStorage.removeItem("driveexotiq_cookie_consent"));
  page.on("request", request => {
    if (/posthog\.com/.test(request.url())) requests.push(request.url());
  });
  await page.goto("/");
  await page.getByRole("link", { name: "Get on the list", exact: true }).first().click();
  await expect(page).toHaveURL(/\/apply/);
  await page.locator('input[name="email"]').focus();
  expect(requests).toEqual([]);
});

test("admin entry never loads PostHog even with stored analytics consent", async ({ page }) => {
  const requests: string[] = [];
  await page.addInitScript(() => localStorage.setItem("driveexotiq_cookie_consent", JSON.stringify({
    functional: true, analytics: true, timestamp: new Date().toISOString(),
  })));
  page.on("request", request => {
    if (/posthog\.com/.test(request.url())) requests.push(request.url());
  });
  await page.goto("/admin");
  expect(requests).toEqual([]);
});
