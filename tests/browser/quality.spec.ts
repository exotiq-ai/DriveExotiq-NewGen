import { test, expect } from "playwright/test";

for (const route of [
  "/",
  "/drives",
  "/tour",
  "/marketplace",
  "/sponsor",
  "/blog",
  "/blog/the-car-sleeper-thesis",
  "/blog/tour-denver",
  "/blog/tour-miami",
  "/apply",
  "/privacy",
  "/terms",
  "/cookies",
  "/sms",
  "/dmca",
]) {
  test(`page integrity ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("#main-content")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    for (const img of await page.locator("main img").all()) {
      // The application artwork is intentionally absent from the compact layout.
      if (!(await img.isVisible())) continue;
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    expect(errors).toEqual([]);
    expect(await page.locator('script[src*="plausible"]').count()).toBe(0);
  });
}

test("film failures retain the poster and invitation", async ({ page }) => {
  await page.route("**/*.mp4", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".home-hero-image")).toBeVisible();
  await expect(page.locator(".home-hero-video")).not.toHaveClass(/is-playing/);
  await page
    .getByRole("link", { name: "Get on the list", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/apply\?interest=drives/);
});

test("Save-Data avoids fetching optional films", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      value: {
        saveData: true,
        addEventListener() {},
        removeEventListener() {},
      },
      configurable: true,
    }),
  );
  const movies: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) movies.push(request.url());
  });
  await page.goto("/");
  await page.locator(".home-road").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: /More switchbacks/ }),
  ).toBeVisible();
  expect(
    await page
      .locator("video")
      .evaluateAll((videos) =>
        videos.every((video) => !video.getAttribute("src")),
      ),
  ).toBe(true);
  expect(movies).toEqual([]);
});

test("initial markup contains posters but no eager video URLs", async ({
  request,
}) => {
  const response = await request.get("/");
  const html = await response.text();
  expect(html).toContain("/media/v3/hero-landscape-");
  expect(html).not.toMatch(/<video[^>]+src=/);
  expect(html).not.toContain("/media/v2/roadbook-1080.mp4");
});

test("legacy routes retain their intended destinations", async ({
  request,
}) => {
  const redirects = [
    ["/astra/hero-garage.webp", "/media/hero-garage.webp"],
    ["/experience", "/"],
    ["/community", "/drives"],
    ["/cities", "/tour"],
    ["/events", "/drives"],
    ["/how-it-works", "/marketplace"],
    ["/booking", "/marketplace"],
    ["/booking/phoenix", "/marketplace"],
    ["/apply?interest=tour", "/sponsor?interest=tour"],
  ];
  for (const [from, to] of redirects) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect([307, 308]).toContain(response.status());
    expect(response.headers().location).toBe(to);
  }
  expect((await request.get("/this-road-does-not-exist")).status()).toBe(404);
});

test("narrow, tablet and landscape layouts remain usable", async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  test.skip(testInfo.project.name !== "desktop");
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 844, height: 390 },
    { width: 932, height: 430 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of ["/", "/apply", "/drives"]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} at ${viewport.width}`,
      ).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const compact =
        viewport.width <= 900 ||
        (viewport.width <= 1024 && viewport.height <= 500);
      if (route === "/apply" && compact) {
        const name = page.getByLabel("Full name", { exact: true });
        await expect(name).toBeVisible();
        if (viewport.height >= 568) {
          const bounds = await name.boundingBox();
          expect(bounds).not.toBeNull();
          expect(bounds!.y).toBeGreaterThanOrEqual(0);
          expect(
            bounds!.y + bounds!.height,
            `First field at ${viewport.width}`,
          ).toBeLessThanOrEqual(viewport.height);
        }
        // Chromium can report a zero-byte cache lookup after the same image's
        // legitimate /drives preload. This journey must add no artwork transfer;
        // the separate fresh-entry case below verifies no image request at all.
        const artworkTransfers = await page.evaluate(() =>
          (
            performance.getEntriesByType(
              "resource",
            ) as PerformanceResourceTiming[]
          )
            .filter(
              (entry) =>
                decodeURIComponent(entry.name).includes(
                  "/media/s8-alpine-drive.webp",
                ) && entry.transferSize > 0,
            )
            .map((entry) => entry.name),
        );
        expect(artworkTransfers).toEqual([]);
      }
    }
    if (
      viewport.width <= 900 ||
      (viewport.width <= 1024 && viewport.height <= 500)
    ) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      const dialog = page.getByRole("dialog", { name: "Site navigation" });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("link", { name: /Partnerships/ }).click();
      await expect(page).toHaveURL(/\/sponsor$/);
    }
  }
});

test("compact application entry does not request hidden desktop artwork", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  const artworkRequests: string[] = [];
  page.on("request", (request) => {
    if (
      decodeURIComponent(request.url()).includes("/media/s8-alpine-drive.webp")
    )
      artworkRequests.push(request.url());
  });
  await page.goto("/apply?interest=drives");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeEnabled();
  await expect(page.getByLabel("Full name", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "What brings you here?" }),
  ).toHaveValue("drives");
  expect(artworkRequests).toEqual([]);
});
