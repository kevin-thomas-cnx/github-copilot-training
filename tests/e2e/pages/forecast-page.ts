import { Page, Locator, expect } from '@playwright/test';

export class ForecastPage {
  readonly page: Page;
  readonly forecastGrid: Locator;
  readonly dayCards: Locator;
  readonly unitCButton: Locator;
  readonly unitFButton: Locator;
  readonly locationHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.forecastGrid = page.locator('.forecast-grid');
    this.dayCards = page.locator('.forecast-day-card');
    this.unitCButton = page.locator('button', { hasText: '°C (Metric)' });
    this.unitFButton = page.locator('button', { hasText: '°F (Imperial)' });
    this.locationHeader = page.locator('h2');
  }

  async expectForecastVisible() {
    await expect(this.forecastGrid).toBeVisible();
    await expect(this.dayCards).toHaveCount(7);
  }

  async expectDayCardContains(index: number, text: string) {
    await expect(this.dayCards.nth(index)).toContainText(text);
  }

  async switchToCelsius() {
    await this.unitCButton.click();
  }

  async switchToFahrenheit() {
    await this.unitFButton.click();
  }

  async expectUnits(unit: 'C' | 'F') {
    for (let i = 0; i < 7; i++) {
      await expect(this.dayCards.nth(i)).toContainText(`°${unit}`);
    }
  }
}
