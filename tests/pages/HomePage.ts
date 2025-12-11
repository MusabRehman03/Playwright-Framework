import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Home Page
 * Example implementation showing best practices
 */
export class HomePage extends BasePage {
  // Locators
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly mainHeading: Locator;
  readonly navigationMenu: Locator;
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.searchInput = page.locator('input[type="search"]');
    this.searchButton = page.locator('button[type="submit"]');
    this.mainHeading = page.locator('h1').first();
    this.navigationMenu = page.locator('nav');
    this.getStartedButton = page.getByRole('link', { name: 'Get started' });
  }

  /**
   * Navigate to home page
   */
  async navigate(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Search for a term
   * @param searchTerm - The term to search for
   */
  async search(searchTerm: string): Promise<void> {
    await this.fillInput(this.searchInput, searchTerm);
    await this.clickElement(this.searchButton);
  }

  /**
   * Get the main heading text
   * @returns The heading text
   */
  async getMainHeading(): Promise<string | null> {
    return await this.getElementText(this.mainHeading);
  }

  /**
   * Click on Get Started button
   */
  async clickGetStarted(): Promise<void> {
    await this.clickElement(this.getStartedButton);
  }

  /**
   * Check if navigation menu is visible
   * @returns True if visible, false otherwise
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.isElementVisible(this.navigationMenu);
  }
}
