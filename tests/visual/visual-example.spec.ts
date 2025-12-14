import { test, expect } from '@playwright/test';
import { Logger } from '../../utils/Logger';

type VisualScenario = 'homepage' | 'header' | 'desktop' | 'mobile' | 'masked';

const VISUAL_DIFF_ALLOWANCES: Record<
  VisualScenario,
  { default: number; overrides?: Record<string, number> }
> = {
  homepage: { default: 100, overrides: { webkit: 200 } },
  header: { default: 50 },
  desktop: { default: 100, overrides: { webkit: 200 } },
  mobile: { default: 100, overrides: { 'mobile-safari': 150 } },
  masked: { default: 50, overrides: { webkit: 200 } },
};

const SNAPSHOT_FILES: Record<VisualScenario, string> = {
  homepage: 'homepage.png',
  header: 'header.png',
  desktop: 'homepage-1920x1080.png',
  mobile: 'homepage-mobile.png',
  masked: 'homepage-masked.png',
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
    await expect(page).toHaveScreenshot(SNAPSHOT_FILES.homepage, {
      fullPage: true,
      maxDiffPixels: homepageDiffAllowance,
    });
  });

  test('should match specific element screenshot', async ({ page }) => {
    Logger.step(1, 'Navigate to page');
    await page.goto('/');

    Logger.step(2, 'Take element screenshot');
    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot(SNAPSHOT_FILES.header, {
      maxDiffPixels: getVisualAllowance(test.info().project.name, 'header'),
    });
  });

  test('should match screenshot with custom viewport', async ({ page }) => {
    Logger.step(1, 'Set custom viewport');
    await page.setViewportSize({ width: 1920, height: 1080 });

    Logger.step(2, 'Navigate and capture');
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // eslint-disable-line playwright/no-wait-for-timeout -- give hero animation a moment to settle for consistent snapshots
    const desktopDiffAllowance = getVisualAllowance(test.info().project.name, 'desktop');
    await expect(page).toHaveScreenshot(SNAPSHOT_FILES.desktop, {
      fullPage: true,
      maxDiffPixels: desktopDiffAllowance,
    });
  });

  test('should match mobile viewport screenshot', async ({ page }) => {
    Logger.step(1, 'Set mobile viewport');
    await page.setViewportSize({ width: 375, height: 667 });

    Logger.step(2, 'Navigate and capture mobile view');
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveScreenshot(SNAPSHOT_FILES.mobile, {
      fullPage: true,
      maxDiffPixels: getVisualAllowance(test.info().project.name, 'mobile'),
    });
  });

  test('should detect visual differences', async ({ page }) => {
    Logger.step(1, 'Navigate to page');
    await page.goto('/');

    Logger.step(2, 'Take masked screenshot (hide dynamic content)');
    const maskedDiffAllowance = getVisualAllowance(test.info().project.name, 'masked');
    await expect(page).toHaveScreenshot(SNAPSHOT_FILES.masked, {
      fullPage: true,
      mask: [page.locator('.dynamic-content')],
      maxDiffPixels: maskedDiffAllowance,
    });
  });
});
