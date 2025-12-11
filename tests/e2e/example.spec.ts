import { test, expect } from '../fixtures/baseFixtures';
import { Logger } from '../utils/Logger';

/**
 * Example E2E test suite
 * Demonstrates best practices for writing Playwright tests
 */
test.describe('Example Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    Logger.info('Starting test case');
    await page.goto('/');
  });

  test('should load home page successfully', async ({ page }) => {
    Logger.step(1, 'Verify page title');
    await expect(page).toHaveTitle(/Playwright/);
    
    Logger.step(2, 'Verify page URL');
    expect(page.url()).toContain('playwright.dev');
  });

  test('should display main heading', async ({ homePage }) => {
    Logger.step(1, 'Navigate to home page');
    await homePage.navigate();
    
    Logger.step(2, 'Get main heading text');
    const heading = await homePage.getMainHeading();
    
    Logger.step(3, 'Verify heading is not empty');
    expect(heading).toBeTruthy();
  });

  test('should have visible navigation', async ({ homePage }) => {
    Logger.step(1, 'Check if navigation is visible');
    const isVisible = await homePage.isNavigationVisible();
    
    Logger.step(2, 'Verify navigation is displayed');
    expect(isVisible).toBe(true);
  });
});

test.describe('API Testing Example', () => {
  test('should make API request successfully', async ({ request }) => {
    Logger.step(1, 'Make GET request to API');
    const response = await request.get('https://api.github.com/repos/microsoft/playwright');
    
    Logger.step(2, 'Verify response status');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    Logger.step(3, 'Verify response contains data');
    const data = await response.json();
    expect(data).toHaveProperty('name');
    expect(data.name).toBe('playwright');
  });
});

test.describe('Mobile Testing Example', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    isMobile: true,
  });

  test('should work on mobile viewport', async ({ page }) => {
    Logger.step(1, 'Navigate to page');
    await page.goto('/');
    
    Logger.step(2, 'Verify page loads on mobile');
    await expect(page).toHaveTitle(/Playwright/);
  });
});
