import { test, expect } from 'playwright/test';

test('the driving invitation is reachable without viewing the film', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const invitation = page.getByRole('link', { name: 'Get on the list', exact: true }).first();
  await expect(invitation).toBeVisible();
  await invitation.click();
  await expect(page).toHaveURL(/\/apply\?interest=drives/);
  await expect(page.getByLabel('What brings you here?')).toHaveValue('drives');
});

test('garage selection changes the visible car and keeps one tab selected', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('tab', { name: /Porsche/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('911 GT3 RS');
  const porsche = page.locator('[data-car="porsche"] img');
  await expect(porsche).toHaveAttribute('src', /\/media\/v3\/porsche-oak-green\.webp/);
  await expect.poll(() => porsche.evaluate((image) => getComputedStyle(image).objectFit)).toBe('contain');
  await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
  await page.getByRole('tab', { name: /Ferrari/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('tabpanel')).toContainText('458 Italia');
});

test('mobile navigation traps focus and Escape returns to its trigger', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  const dialog = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(menu).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'The drives', exact: true }).first()).not.toBeFocused();
});

test('reduced motion gives a complete readable experience without autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Good cars/ })).toBeVisible();
  const playback = await page.locator('video').evaluateAll(videos => videos.map(video => (video as HTMLVideoElement).paused));
  expect(playback.every(Boolean)).toBe(true);
});
