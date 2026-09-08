import { test, expect } from 'playwright/test';

for (const film of [
  { section: '.home-hero', video: '.home-hero-video', poster: '.home-hero-image', name: 'garage' },
  { section: '.home-road', video: '.home-road-video', poster: '.home-road > img', name: 'road' },
  { section: '.home-pair-media', video: '.home-pair-video', poster: '.home-pair-media > img', name: 'Telluride' },
]) {
  test(`${film.name} film restores its poster after a playback error`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.locator(film.section).scrollIntoViewIfNeeded();
    const video = page.locator(film.video);
    await expect(page.getByRole('button', { name: `Pause film: ${film.name}`, exact: true })).toBeVisible();
    await expect(video).toHaveCSS('opacity', '1');

    // A decode/network failure can arrive after a frame was already displayed.
    await video.evaluate(element => element.dispatchEvent(new Event('error')));

    await expect(video).toHaveCSS('opacity', '0');
    await expect(page.locator(film.poster)).toBeVisible();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    const controls = page.getByRole('button', { name: new RegExp(`^(Play|Pause) film: ${film.name}$`) });
    await expect(controls).toHaveCount(0);

    // Later visibility events must not retry a failed source or revive a stale control.
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await expect(controls).toHaveCount(0);
    await expect(video).toHaveCSS('opacity', '0');
    await expect(page.getByRole('link', { name: 'Get on the list', exact: true }).first()).toBeVisible();
  });
}
