import { test, expect } from '@playwright/test';
import { Logger } from '../utils/Logger';

/**
 * Visual Testing Examples
 * Demonstrates visual regression testing with Playwright
 */
test.describe('Visual Regression Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    Logger.step(1, 'Navigate to homepage');
    await page.goto('/');

    Logger.step(2, 'Take screenshot and compare');
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should match specific element screenshot', async ({ page }) => {
    Logger.step(1, 'Navigate to page');
    await page.goto('/');

    Logger.step(2, 'Take element screenshot');
    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot('header.png');
  });

  test('should match screenshot with custom viewport', async ({ page }) => {
    Logger.step(1, 'Set custom viewport');
    await page.setViewportSize({ width: 1920, height: 1080 });

    Logger.step(2, 'Navigate and capture');
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-1920x1080.png', {
      fullPage: true,
    });
  });

  test('should match mobile viewport screenshot', async ({ page }) => {
    Logger.step(1, 'Set mobile viewport');
    await page.setViewportSize({ width: 375, height: 667 });

    Logger.step(2, 'Navigate and capture mobile view');
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });

  test('should detect visual differences', async ({ page }) => {
    Logger.step(1, 'Navigate to page');
    await page.goto('/');

    Logger.step(2, 'Take masked screenshot (hide dynamic content)');
    await expect(page).toHaveScreenshot('homepage-masked.png', {
      fullPage: true,
      mask: [page.locator('.dynamic-content')],
      maxDiffPixels: 50,
    });
  });
});
