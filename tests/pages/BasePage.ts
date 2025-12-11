import { Page, Locator } from '@playwright/test';

/**
 * Base Page class that all page objects should extend
 * Contains common methods used across all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get the current page title
   * @returns The page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('load');
  }

  /**
   * Take a screenshot
   * @param name - The name of the screenshot file
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Wait for an element to be visible
   * @param locator - The locator of the element
   */
  async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Click on an element with retry logic
   * @param locator - The locator of the element to click
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input field
   * @param locator - The locator of the input field
   * @param text - The text to fill
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  /**
   * Get text from an element
   * @param locator - The locator of the element
   * @returns The text content
   */
  async getElementText(locator: Locator): Promise<string | null> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent();
  }

  /**
   * Check if element is visible
   * @param locator - The locator of the element
   * @returns True if visible, false otherwise
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Scroll to element
   * @param locator - The locator of the element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }
}
