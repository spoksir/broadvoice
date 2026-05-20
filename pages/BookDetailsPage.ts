import { Page, Locator, expect } from '@playwright/test';

export class BookDetailsPage {
  readonly page: Page;
  readonly authorName: Locator;
  readonly isbnNumber: Locator;
  readonly pagesCount: Locator;
  readonly dimensions: Locator;
  readonly idiom: Locator;
  readonly languageFlag: Locator;

  constructor(page: Page) {
    this.page = page;
    // Estrutura dos livros
    this.authorName = page.locator('//*[@id="productPageSectionDetails-collapseDetalhes-content-author"]/a');
    this.isbnNumber = page.locator('//*[@id="productPageSectionDetails-collapseDetalhes-content-isbn"]/div').first();
    this.pagesCount = page.locator('//*[@id="productPageSectionDetails-collapseDetalhes-content-nrPages"]/div').first();
    this.dimensions = page.locator('//*[@id="productPageSectionDetails-collapseDetalhes-content-dimensions"]/div').first();
    this.idiom = page.locator('//*[@id="productPageSectionDetails-collapseDetalhes-content-language"]/div').first();
    this.languageFlag = page.locator('//*[@id="productPageRightSectionTop-languageFlag"]');
  }

  async validateAuthor(expectedAuthor: string) {
    await expect(this.authorName).toHaveText(expectedAuthor);
  }

  async validateISBN(expectedISBN: string) {
    await expect(this.isbnNumber).toHaveText(expectedISBN);
  }

  async getAuthorName(): Promise<string> {
    return (await this.authorName.textContent()) || '';
  }

  async validateIdiomAndFlag() {
    // Scenario 3
    await expect(this.idiom).toHaveText('Inglês');
    await expect(this.languageFlag).toBeVisible();
  }
}