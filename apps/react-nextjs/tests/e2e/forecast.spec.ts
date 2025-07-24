import { test, expect } from '@playwright/test';
import { SearchPage } from './pages/search-page';
import { ForecastPage } from './pages/forecast-page';

// Example location for test
const TEST_LOCATION = 'San Francisco';

test.describe('7 Day Forecast UI', () => {
  test('displays 7 day forecast after searching and selecting a location', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const forecastPage = new ForecastPage(page);

    await searchPage.goto();
    await searchPage.searchLocation(TEST_LOCATION);
    await searchPage.expectResult(TEST_LOCATION);
    await searchPage.clickResult(TEST_LOCATION);

    await forecastPage.expectForecastVisible();
    await forecastPage.expectUnits('C'); // Default to Celsius
  });

  test('allows switching between Celsius and Fahrenheit', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const forecastPage = new ForecastPage(page);

    await searchPage.goto();
    await searchPage.searchLocation(TEST_LOCATION);
    await searchPage.expectResult(TEST_LOCATION);
    await searchPage.clickResult(TEST_LOCATION);

    await forecastPage.expectForecastVisible();
    await forecastPage.switchToFahrenheit();
    await forecastPage.expectUnits('F');
    await forecastPage.switchToCelsius();
    await forecastPage.expectUnits('C');
  });
});
