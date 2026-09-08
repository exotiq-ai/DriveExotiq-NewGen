import { test, expect } from 'playwright/test';

test('the road film loads only on request, pauses background films, and releases on close', async ({ page }) => {
  const filmRequests: string[] = [];
  const modalPosters: string[] = [];
  page.on('request', request => { if (request.url().includes('/film-roadbook.mp4')) filmRequests.push(request.url()); });
  page.on('request', request => { if (new URL(request.url()).pathname === '/astra/telluride-pair.webp') modalPosters.push(request.url()); });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /Watch the road film/ });
  await trigger.scrollIntoViewIfNeeded();
  expect(filmRequests).toEqual([]);
  expect(modalPosters).toEqual([]);
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: /A little further out/ });
  await expect(dialog).toBeVisible();
  const film = page.locator('.home-full-film');
  await expect.poll(() => film.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
  expect(filmRequests.length).toBeGreaterThan(0);
  await expect.poll(() => page.locator('video:not(.home-full-film)').evaluateAll(videos => videos.every(video => (video as HTMLVideoElement).paused))).toBe(true);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(() => film.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await page.evaluate(() => { Reflect.deleteProperty(document, 'hidden'); document.dispatchEvent(new Event('visibilitychange')); });
  expect(await film.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await dialog.getByRole('button', { name: 'Close road film' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await film.getAttribute('src')).toBeNull();
  expect(await film.getAttribute('poster')).toBeNull();
  expect(await film.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('a failed road film provides a useful fallback and Escape restores focus', async ({ page }) => {
  await page.route('**/film-roadbook.mp4', route => route.abort());
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /Watch the road film/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: /A little further out/ });
  await expect(dialog.getByRole('alert')).toContainText('The film couldn’t load');
  await expect(dialog.getByRole('link', { name: 'Explore the roadbook' })).toHaveAttribute('href', '/tour');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('data-saving and reduced-motion visitors can explicitly choose the road film', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, addEventListener() {}, removeEventListener() {} }, configurable: true }));
  const movies: string[] = [];
  page.on('request', request => { if (request.url().endsWith('.mp4')) movies.push(request.url()); });
  await page.goto('/');
  await page.locator('.home-pair-media').scrollIntoViewIfNeeded();
  await expect(page.locator('.home-experience')).toHaveAttribute('data-motion', 'off');
  expect(movies).toEqual([]);
  await page.getByRole('button', { name: /Watch the road film/ }).click();
  const dialog = page.getByRole('dialog', { name: /A little further out/ });
  await expect(dialog).toBeVisible();
  await expect.poll(() => movies.length).toBeGreaterThan(0);
  expect(movies.every(url => url.endsWith('/film-roadbook.mp4'))).toBe(true);
  await page.keyboard.press('Escape');
});

test('chapter navigation follows the real sections without trapping scroll', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  await page.goto('/');
  const chapters = page.getByRole('navigation', { name: 'Chapters in the drive' });
  await chapters.getByRole('link', { name: '4. The people' }).click();
  await expect(page).toHaveURL(/#the-people$/);
  await expect(chapters.getByRole('link', { name: '4. The people' })).toHaveAttribute('aria-current', 'location');
  await expect(page.getByRole('heading', { name: /Some cars get collected/ })).toBeInViewport();
  await chapters.getByRole('link', { name: '5. Your invitation' }).click();
  await expect(chapters.getByRole('link', { name: '5. Your invitation' })).toHaveAttribute('aria-current', 'location');
  await expect(page.getByRole('heading', { name: /See you out there/ })).toBeInViewport();
});
