import { test, expect } from '@playwright/test';

// Sample UI test: checks if the homepage loads and displays the app title

test('homepage should display app title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/weather/i);
  await expect(page.locator('h1, h2, h3')).toContainText([/weather/i]);
});
