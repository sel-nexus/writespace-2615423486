import { test, expect } from '@playwright/test';

test('guest discovers WriteSpace and is directed to login to read', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__WRITESPACE_TEST_LATEST_WRITING_DELAY_MS__ = 250;
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'WriteSpace' })).toBeVisible();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Loading latest writing…');
  await expect(page.getByText('No posts yet — check back soon!')).toBeVisible();
  await page.getByRole('button', { name: 'Start Reading' }).click();
  await expect(page).toHaveURL(/\/login/);
  expect(errors).toEqual([]);
});