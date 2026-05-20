import { test, expect } from '@playwright/test';
import { acceptCookies } from './utils';
import { HomePage } from '../pages/HomePage';
import { BookDetailsPage } from '../pages/BookDetailsPage';

let homePage: HomePage;
let bookDetailsPage: BookDetailsPage;

test.beforeEach(async ({ page }) => {
  // Initialize Page Objects
  homePage = new HomePage(page);
  bookDetailsPage = new BookDetailsPage(page);
  
  await homePage.goto();
  await acceptCookies(page);
});

test('Scenario 1: Validate 1984 book specifications', async ({ page }) => {
  // Search for the book "1984"
  await homePage.searchForBook('1984');

  // Locate the book card corresponding to ISBN 9789722071550 (product ID 24575767)
  const bookCard = page.locator('#search-24575767');

  // Validate that the author in search result is "George Orwell"
  await expect(bookCard.locator('.authors')).toContainText('George Orwell');

  // Click on the book title to open its detail page
  await bookCard.locator('a.title-lnk, a.track').first().click();

  // Validate author on product page
  await bookDetailsPage.validateAuthor('George Orwell');

  // Confirm that the ISBN is "9789722071550"
  await bookDetailsPage.validateISBN('9789722071550');

  // Check that the number of pages is "344"
  await expect(bookDetailsPage.pagesCount).toContainText('344');

  // Ensure that the dimensions of the book are "156 x 238 x 22 mm"
  await expect(bookDetailsPage.dimensions).toContainText('156 x 238 x 22 mm');
});

test('Scenario 2: Verify corresponding authors', async ({ page }) => {
  // Search for the book "1984"
  await homePage.searchForBook('1984');

  // Verify that the book "1984" is authored by George Orwell
  const bookCard1984 = page.locator('#search-24575767');
  await expect(bookCard1984.locator('.authors')).toContainText('George Orwell');

  // Search for the book "A Quinta dos Animais"
  await homePage.searchForBook('A Quinta dos Animais');

  // Verify that the book "A Quinta dos Animais" is authored by the same author
  const bookCardQuinta = page.locator('.authors').first();
  await expect(bookCardQuinta).toContainText('George Orwell');
});

test('Scenario 3: Verify idiom and language flag', async ({ page }) => {
  // Search for the book "Do Not Disturb"
  await homePage.searchForBook('Do Not Disturb');

  // Click on the book card to open its detail page
  const firstBook = page.locator('.title-lnk').first();
  await firstBook.click(); 

  // Validate author is "Freida McFadden"
  await bookDetailsPage.validateAuthor('Freida McFadden');
  
  // Validate idiom and flag is English
  await bookDetailsPage.validateIdiomAndFlag();
});

test('Scenario 4: Add to cart', async ({ page }) => {
  // Search for the book "1984"
  await homePage.searchForBook('1984');

  // Open book page
  const firstBook = page.locator('.title-lnk').first();
  await firstBook.click();

  // Add to cart
  const buyButton = page.locator('#productPageRightSectionTop-actions-addCart-btn');
  await page.waitForTimeout(1500); // webkit is failing without timeout
  await buyButton.click();
  await page.waitForTimeout(1000); 

  // Observe if "1" appear in cart icon
  const cartBadge = page.locator('//*[@id="badge-shoppingCart"]');
  await expect(cartBadge).toContainText('1');
});

test('Scenario 5: Search non existing book', async ({ page }) => {
  // Search for a non existing book -> "livroinexistentexyz123"
  await homePage.searchForBook('livroinexistentexyz123');
  
  // Verify that a "0 resultados" message is displayed
  const noResultsMsg = page.getByText('0 resultados.', { exact: false });
  await expect(noResultsMsg).toBeVisible();
});