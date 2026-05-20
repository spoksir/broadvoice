import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Search bar
    this.searchInput = page.locator('//*[@id="form-searchform-palavra"]');
    this.searchButton = page.locator('//*[@id="search-bar"]/button[2]/img');
  }

  async goto() {
    await this.page.goto('https://www.bertrand.pt/');
  }

  async searchForBook(title: string) {
    await this.searchInput.fill(title);
    await this.searchButton.click();
  }
}