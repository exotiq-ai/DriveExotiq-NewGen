import { test, expect } from "playwright/test";

for (const film of [
  {
    section: ".home-hero",
    video: ".home-hero-video",
    poster: ".home-hero-image",
    name: "garage",
  },
  {
    section: ".home-road",
    video: ".home-road-video",
    poster: ".home-road > img",
    name: "road",
  },
  {
    section: ".home-pair-media",
    video: ".home-pair-video",
    poster: ".home-pair-media > img",
    name: "Telluride",
  },
]) {
  test(`${film.name} film restores its poster after a playback error`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.locator(film.section).scrollIntoViewIfNeeded();
    const video = page.locator(film.video);
    await expect(
      page.getByRole("button", {
        name: `Pause film: ${film.name}`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(video).toHaveCSS("opacity", "1");

    // A decode/network failure can arrive after a frame was already displayed.
    await video.evaluate((element) =>
      element.dispatchEvent(new Event("error")),
    );

    await expect(video).toHaveCSS("opacity", "0");
    await expect(page.locator(film.poster)).toBeVisible();
    await expect
      .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
      .toBe(true);
    const controls = page.getByRole("button", {
      name: new RegExp(`^(Play|Pause) film: ${film.name}$`),
    });
    await expect(controls).toHaveCount(0);

    // Later visibility events must not retry a failed source or revive a stale control.
    await page.evaluate(() =>
      document.dispatchEvent(new Event("visibilitychange")),
    );
    await expect(controls).toHaveCount(0);
    await expect(video).toHaveCSS("opacity", "0");
    await expect(
      page.getByRole("link", { name: "Get on the list", exact: true }).first(),
    ).toBeVisible();
  });
}

test("completed hero holds its final frame until explicit replay", async ({
  page,
}) => {
  await page.goto("/");
  const video = page.locator(".home-hero-video");
  await expect(
    page.getByRole("button", { name: "Pause film: garage" }),
  ).toBeVisible();
  await video.evaluate((element: HTMLVideoElement) => {
    Object.defineProperty(element, "paused", {
      configurable: true,
      get: () => true,
    });
    (window as typeof window & { heroPlayCalls?: number }).heroPlayCalls = 0;
    element.play = () => {
      (window as typeof window & { heroPlayCalls?: number }).heroPlayCalls! +=
        1;
      return Promise.resolve();
    };
    element.dispatchEvent(new Event("ended"));
  });
  await expect(
    page.getByRole("button", { name: "Replay film: garage" }),
  ).toBeVisible();
  await page.evaluate(() => {
    document.dispatchEvent(new Event("visibilitychange"));
    document.dispatchEvent(
      new CustomEvent("site:film-modal", { detail: { open: true } }),
    );
    document.dispatchEvent(
      new CustomEvent("site:film-modal", { detail: { open: false } }),
    );
  });
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { heroPlayCalls?: number }).heroPlayCalls,
    ),
  ).toBe(0);
  await page.getByRole("button", { name: "Replay film: garage" }).click();
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { heroPlayCalls?: number }).heroPlayCalls,
    ),
  ).toBe(1);
});

test("a broken hero poster permanently suppresses optional motion", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLImageElement.prototype.decode = function () {
      return this.classList.contains("home-hero-image")
        ? Promise.reject(new DOMException("decode failed"))
        : Promise.resolve();
    };
  });
  await page.goto("/");
  const video = page.locator(".home-hero-video");
  await expect.poll(() => video.getAttribute("src")).toBeNull();
  await page.evaluate(() => {
    document.dispatchEvent(new Event("visibilitychange"));
    document.dispatchEvent(
      new CustomEvent("site:film-modal", { detail: { open: false } }),
    );
  });
  await expect(video).not.toHaveAttribute("src", /.+/);
  await expect(
    page.getByRole("button", { name: "Play film: garage" }),
  ).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Get on the list", exact: true }).first(),
  ).toBeVisible();
});

test("hero source waits through decode and the first animation frame before assignment", async ({
  page,
}) => {
  await page.addInitScript(() => {
    let resolveHero!: () => void;
    const heroDecode = new Promise<void>((resolve) => {
      resolveHero = resolve;
    });
    (
      window as typeof window & { resolveHeroPoster?: () => void }
    ).resolveHeroPoster = resolveHero;
    HTMLImageElement.prototype.decode = function () {
      return this.classList.contains("home-hero-image")
        ? heroDecode
        : Promise.resolve();
    };
  });
  await page.goto("/");
  const video = page.locator(".home-hero-video");
  const expectedSource = await page.evaluate(() => {
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const mobile = matchMedia("(max-width: 767px)").matches;
    if (!mobile) return "/media/v3/hero-landscape-1080.mp4";
    const slow =
      connection?.saveData ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
    return slow || !connection?.effectiveType
      ? "/media/v3/hero-portrait-720.mp4"
      : "/media/v3/hero-portrait-1080.mp4";
  });
  await expect(video).not.toHaveAttribute("src", /.+/);
  const sourceAbsentInFirstFrame = await page.evaluate(async () => {
    (
      window as typeof window & { resolveHeroPoster?: () => void }
    ).resolveHeroPoster?.();
    await Promise.resolve();
    return new Promise<boolean>((resolve) =>
      requestAnimationFrame(() => {
        resolve(
          !document
            .querySelector<HTMLVideoElement>(".home-hero-video")
            ?.hasAttribute("src"),
        );
      }),
    );
  });
  expect(sourceAbsentInFirstFrame).toBe(true);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  );
  await expect(video).toHaveAttribute("src", expectedSource);
});

test("a permanently failed road film offers a durable alternative", async ({
  page,
}) => {
  await page.route("**/media/v2/roadbook-*.mp4", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("button", { name: /Watch the road film/ }).click();
  const alert = page.getByRole("dialog").getByRole("alert");
  await expect(alert).toHaveText(
    "The film couldn’t load. Explore the roadbook instead.",
  );
  await expect(
    alert.getByRole("link", { name: "Explore the roadbook" }),
  ).toHaveAttribute("href", "/tour");
});
