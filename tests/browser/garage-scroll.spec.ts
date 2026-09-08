import { test, expect, type Page } from 'playwright/test';

async function atProgress(page: Page, progress: number) {
  await page.locator('.garage-study').evaluate((root, value) => {
    const stage = root.querySelector('.garage-study-stage') as HTMLElement;
    const top = root.getBoundingClientRect().top + scrollY - 88;
    scrollTo({ top: top + (root.clientHeight - stage.clientHeight) * value, behavior: 'instant' });
  }, progress);
}

test('desktop garage stays in view and its camera reverses with native scroll', async ({ page }, info) => {
  test.skip(info.project.name.includes('mobile'));
  await page.goto('/');
  const study = page.locator('.garage-study');
  await expect(study).toHaveAttribute('data-cinematic', 'true');
  await atProgress(page, 0.12);
  await expect(page.getByRole('tabpanel')).toContainText('720S');
  await expect.poll(() => page.locator('[data-car-layer="0"] img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: '../evidence/v2/garage/desktop-mclaren.png' });
  const firstPose = await page.locator('[data-car-layer="0"]').evaluate(el => el.style.transform);
  await atProgress(page, 0.23);
  await expect.poll(() => page.locator('[data-car-layer="0"]').evaluate(el => el.style.transform)).not.toBe(firstPose);
  await atProgress(page, 0.5);
  await expect(page.getByRole('tabpanel')).toContainText('911 GT3 RS');
  await expect.poll(() => page.locator('[data-car-layer="1"] img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: '../evidence/v2/garage/desktop-porsche.png' });
  const middlePose = await page.locator('[data-car-layer="1"]').evaluate(el => el.style.transform);
  expect(await page.locator('.garage-study-stage').evaluate(el => Math.abs(el.getBoundingClientRect().top - 88))).toBeLessThan(2);
  await atProgress(page, 0.88);
  await expect(page.getByRole('tabpanel')).toContainText('458 Italia');
  await expect.poll(() => page.locator('[data-car-layer="2"] img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: '../evidence/v2/garage/desktop-ferrari.png' });
  await atProgress(page, 0.5);
  await expect(page.getByRole('tabpanel')).toContainText('911 GT3 RS');
  await expect.poll(() => page.locator('[data-car-layer="1"]').evaluate(el => el.style.transform)).toBe(middlePose);
  await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
  await atProgress(page, 1.15);
  expect(await page.locator('.garage-study-stage').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(88);
});

test('garage selection keeps keyboard focus and matches the scroll chapter', async ({ page }, info) => {
  await page.goto('/');
  const porsche = page.getByRole('tab', { name: /Porsche/ });
  await porsche.click();
  await expect(page.getByRole('tabpanel')).toContainText('911 GT3 RS');
  if (info.project.name.includes('mobile')) {
    await page.locator('.garage-study').evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 72, behavior: 'instant' }));
    await expect.poll(() => page.locator('[data-car-layer="1"] img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    await page.locator('.garage-study').screenshot({ path: `../evidence/v2/garage/${info.project.name}-porsche.png` });
    expect(await page.locator('.home-car-spec').evaluate(el => el.getBoundingClientRect().bottom <= el.closest('.home-car-panel')!.getBoundingClientRect().bottom)).toBe(true);
  }
  await porsche.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Ferrari/ })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('458 Italia');
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: /McLaren/ })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('720S');
});

for (const fallback of ['reduced motion', 'Save-Data', 'short viewport'] as const) {
  test(`garage uses a compact complete fallback for ${fallback}`, async ({ page }) => {
    if (fallback === 'reduced motion') await page.emulateMedia({ reducedMotion: 'reduce' });
    if (fallback === 'Save-Data') await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true, addEventListener() {}, removeEventListener() {} } }));
    if (fallback === 'short viewport') await page.setViewportSize({ width: 1440, height: 600 });
    await page.goto('/');
    const study = page.locator('.garage-study');
    await expect(study).toHaveAttribute('data-cinematic', 'false');
    await page.getByRole('tab', { name: /Ferrari/ }).click();
    await expect(page.getByRole('tabpanel')).toContainText('458 Italia');
    await expect(page.locator('.garage-study-stage')).toHaveCSS('position', 'relative');
    expect(await study.evaluate(el => el.clientHeight)).toBeLessThan(1100);
    await expect(page.locator('[data-car-layer="2"]')).toHaveCSS('transform', 'none');
  });
}

test('a failed car image leaves readable content without an empty pinned chapter', async ({ page }) => {
  await page.route('**/astra/car-ferrari.webp', route => route.abort());
  await page.goto('/');
  await page.getByRole('tab', { name: /Ferrari/ }).click();
  await expect(page.locator('.garage-study')).toHaveAttribute('data-cinematic', 'false');
  await expect(page.getByRole('tabpanel')).toContainText('458 Italia');
  await expect(page.getByRole('tabpanel')).toContainText('Some things need no translation.');
  await expect(page.getByRole('tabpanel')).toBeInViewport();
  await expect(page.locator('.garage-study-stage')).toHaveCSS('position', 'relative');
  await page.getByRole('tab', { name: /Porsche/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('911 GT3 RS');
});
