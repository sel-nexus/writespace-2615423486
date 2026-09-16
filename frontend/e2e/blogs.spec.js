import { test, expect } from '@playwright/test';

test('writer creates, reloads, and reads a persistent local post', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/register');
  await page.getByLabel('Display Name').fill('Mina');
  await page.getByLabel('Username').fill('mina');
  await page.getByLabel('Password', { exact: true }).fill('pass');
  await page.getByLabel('Confirm Password').fill('pass');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Write', exact: true }).click();
  await page.getByLabel('Title').fill('Browser local writing');
  await page.getByLabel('Content').fill('This post is saved and rendered from local storage.');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('heading', { name: 'Browser local writing' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Browser local writing' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to All Posts' }).click();
  await expect(page.getByText('Browser local writing')).toBeVisible();
  expect(errors).toEqual([]);
});

test('writer uses the mobile hamburger navigation and captures the open menu', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/register');
  await page.getByLabel('Display Name').fill('Mina');
  await page.getByLabel('Username').fill('mina');
  await page.getByLabel('Password', { exact: true }).fill('pass');
  await page.getByLabel('Confirm Password').fill('pass');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  const mobileWriteLink = page.getByRole('navigation').getByRole('link', { name: 'Write', exact: true });
  await expect(mobileWriteLink).toBeVisible();
  await page.screenshot({ path: 'test-results/mobile-hamburger-navigation.png', fullPage: true });
  await mobileWriteLink.click();
  await expect(page.getByRole('heading', { name: 'Write a post' })).toBeVisible();
  expect(errors).toEqual([]);
});