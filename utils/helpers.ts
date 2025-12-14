import { Page } from '@playwright/test';

/**
 * Collection of helper functions for tests
 */

/**
 * Wait for a specific amount of time
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get current timestamp
 * @returns Current timestamp as string
 */
export function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Format date for display
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Check if element exists on page
 * @param page - Playwright page object
 * @param selector - CSS selector
 * @returns True if element exists, false otherwise
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return (await page.locator(selector).count()) > 0;
}

/**
 * Get environment variable with fallback
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Environment variable value or default
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Retry an async function with exponential backoff
 * @param fn - Function to retry
 * @param retries - Number of retries
 * @param delay - Initial delay in ms
 * @returns Result of the function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    await wait(delay);
    return retry(fn, retries - 1, delay * 2);
  }
}
