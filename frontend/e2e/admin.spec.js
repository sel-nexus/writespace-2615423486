import { test, expect } from '@playwright/test';

test('administrator manages local accounts', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Administrator dashboard' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByLabel('Display Name').fill('Eli');
  await page.getByLabel('Username').fill('eli');
  await page.getByLabel('Password').fill('pass');
  await page.getByRole('button', { name: 'Create User' }).click();
  await expect(page.locator('main section').last()).toContainText('eli');
  await expect(page.getByTitle('Default admin cannot be deleted.')).toBeDisabled();
  expect(errors).toEqual([]);
});