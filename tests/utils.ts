import { Page } from '@playwright/test';

/**
 * Accepts cookies on Bertrand.pt if the banner is present.
 */
export async function acceptCookies(page: Page) {
  try {
    const acceptCookiesBtn = page.getByRole('button', { name: 'Aceitar' });
    // 2s to wait for cookies banner
    await acceptCookiesBtn.waitFor({ timeout: 2000 });
    await acceptCookiesBtn.click();
  } catch (e) {
    // Ignore if cookie banner is not found
  }
}
