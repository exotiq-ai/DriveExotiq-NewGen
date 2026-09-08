import { test, expect } from 'playwright/test';

test('preview application validates, completes, and sends no production traffic', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (/supabase\.co|resend\.com|plausible\.io/.test(request.url())) external.push(request.url()); });
  await page.goto('/apply?interest=drives');
  await expect(page.getByRole('note')).toContainText('Submissions are not saved');
  await page.getByRole('button', { name: 'Get on the list', exact: true }).click();
  await expect(page.getByText('Full name is required', { exact: true })).toBeVisible();
  await page.getByLabel('Full name', { exact: true }).fill('Astra Preview');
  await page.getByLabel('Email address', { exact: true }).fill('astra-preview@example.com');
  await page.getByLabel('Phone', { exact: true }).fill('2025550147');
  await page.getByLabel('Current city', { exact: true }).fill('Denver');
  await page.getByLabel('City you’d drive in').fill('Denver');
  await page.getByLabel('Tell us what you drive').fill('A weekend road car and a love of mountain roads.');
  await page.getByRole('checkbox', { name: /I agree to/ }).check();
  const response = page.waitForResponse(r => r.url().includes('/api/applications') && r.request().method() === 'POST');
  await page.getByRole('button', { name: 'Get on the list', exact: true }).click();
  const result = await response;
  expect(result.status()).toBe(201);
  expect(await result.json()).toMatchObject({ success: true, preview: true });
  await expect(page).toHaveURL(/\/thank-you\?interest=drives/);
  await expect(page.getByText(/no information was saved and no email or text was sent/i)).toBeVisible();
  expect(external).toEqual([]);
});

test('marketplace waitlist is an honest preview', async ({ page }) => {
  await page.goto('/marketplace');
  await page.getByLabel('Email address', { exact: true }).fill('astra-preview@example.com');
  await page.getByRole('button', { name: 'Join the waitlist', exact: true }).click();
  await expect(page.getByText('Preview complete', { exact: true })).toBeVisible();
  await expect(page.getByText(/No information was saved and no email was sent/)).toBeVisible();
});

test('partnership form completes without promising a real submission', async ({ page }) => {
  await page.goto('/sponsor?interest=partnership');
  await page.getByLabel('Your name', { exact: true }).fill('Astra Preview');
  await page.getByLabel('Email address', { exact: true }).fill('astra-preview@example.com');
  await expect(page.getByLabel('Sponsorship interest')).toHaveValue('partnership');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByText('Preview complete', { exact: true })).toBeVisible();
});

test('form failure preserves entered information and explains the error', async ({ page }) => {
  await page.route('**/api/waitlist', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"Temporarily unavailable"}' }));
  await page.goto('/marketplace');
  await page.getByLabel('Email address', { exact: true }).fill('astra-preview@example.com');
  await page.getByRole('button', { name: 'Join the waitlist', exact: true }).click();
  await expect(page.locator('form').getByRole('alert')).toContainText('Something didn’t go through');
  await expect(page.getByLabel('Email address', { exact: true })).toHaveValue('astra-preview@example.com');
});
