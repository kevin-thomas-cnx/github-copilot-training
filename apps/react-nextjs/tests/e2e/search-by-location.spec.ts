import { test, expect } from '@playwright/test';
import { SearchPage } from './pages/search-page';

test.describe('Search by Location', () => {
  test.beforeEach(async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('should display results for a valid location', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.searchLocation('New York');
    await searchPage.expectResult('New York');
  });

  test('should show error for invalid location', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.searchLocation('InvalidLocationXYZ');
    await searchPage.expectError('No locations found');
  });

});
