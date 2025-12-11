import { test, expect } from '@playwright/test';
import { Logger } from '../utils/Logger';

type VisualScenario = 'homepage' | 'desktop' | 'masked';

const VISUAL_DIFF_ALLOWANCES: Record<
  VisualScenario,
  { default: number; overrides?: Record<string, number> }
> = {
  homepage: { default: 100, overrides: { webkit: 200 } },
  desktop: { default: 100, overrides: { webkit: 200 } },
  masked: { default: 50, overrides: { webkit: 200 } },
};

function getVisualAllowance(projectName: string, scenario: VisualScenario): number {
  const config = VISUAL_DIFF_ALLOWANCES[scenario];
  return config.overrides?.[projectName] ?? config.default;
}

/**
 * Visual Testing Examples
 * Demonstrates visual regression testing with Playwright
 */
test.describe('Visual Regression Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    Logger.step(1, 'Navigate to homepage');
    await page.goto('/');

    Logger.step(2, 'Take screenshot and compare');
    const homepageDiffAllowance = getVisualAllowance(test.info().project.name, 'homepage');
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: homepageDiffAllowance,
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
    const desktopDiffAllowance = getVisualAllowance(test.info().project.name, 'desktop');
    await expect(page).toHaveScreenshot('homepage-1920x1080.png', {
      fullPage: true,
      maxDiffPixels: desktopDiffAllowance,
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
    const maskedDiffAllowance = getVisualAllowance(test.info().project.name, 'masked');
    await expect(page).toHaveScreenshot('homepage-masked.png', {
      fullPage: true,
      mask: [page.locator('.dynamic-content')],
      maxDiffPixels: maskedDiffAllowance,
    });
  });
});
