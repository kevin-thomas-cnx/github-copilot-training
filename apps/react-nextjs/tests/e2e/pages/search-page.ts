import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resultsList: Locator;
  readonly resultButtons: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[aria-label="Search for locations by city or airport name"]');
    this.searchButton = page.locator('button.search-button');
    this.resultsList = page.locator('ul[aria-label="List of matching locations"]');
    this.resultButtons = page.locator('button.location-item-button');
    this.errorAlert = page.locator('div.error-alert[role="alert"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchLocation(location: string) {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(location);
    await this.searchButton.click();
  }

  async expectResult(location: string) {
    await expect(this.resultsList).toBeVisible();
    await expect(this.resultsList).toContainText(location);
  }

  async clickResult(location: string) {
    await this.resultButtons.filter({ hasText: location }).first().click();
  }

  async expectNoResults() {
    // Check that the results list has no items
    await expect(this.resultsList.locator('li')).toHaveCount(0);
  }

  async expectError(message: string) {
    await expect(this.errorAlert).toContainText(message);
  }
}
