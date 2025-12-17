import { test, expect } from '@playwright/test';
import { Logger } from '../../utils/Logger';
import { comparePageWithSnapshot } from '../../utils/visualDiff';
import type { Locator } from '@playwright/test';

type VisualScenario = 'homepage' | 'header' | 'desktop' | 'mobile' | 'masked';

const VISUAL_DIFF_ALLOWANCES: Record<
  VisualScenario,
  { default: number; overrides?: Record<string, number> }
> = {
  homepage: { default: 0.08, overrides: { webkit: 0.1 } },
  header: { default: 0.05 },
  desktop: { default: 0.08, overrides: { webkit: 0.1 } },
  mobile: { default: 0.08, overrides: { 'mobile-safari': 0.1 } },
  masked: { default: 0.08, overrides: { webkit: 0.1 } },
};

const DIMENSION_MISMATCH_TOLERANCE: Record<
  VisualScenario,
  { default: number; overrides?: Record<string, number> }
> = {
  homepage: { default: 0.02 },
  header: { default: 0.01 },
  desktop: { default: 0.02 },
  mobile: { default: 0.03 },
  masked: { default: 0.02 },
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

function getDimensionMismatchTolerance(projectName: string, scenario: VisualScenario): number {
  const config = DIMENSION_MISMATCH_TOLERANCE[scenario];
  return config.overrides?.[projectName] ?? config.default;
}

type BoundingBox = NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>;

async function getBoundingBoxOrFail(locator: Locator, description: string): Promise<BoundingBox> {
  const boundingBox = await locator.boundingBox();
  if (!boundingBox) {
    throw new Error(`Unable to resolve ${description} bounding box for visual comparison.`);
  }
  return boundingBox;
}

/**
 * Visual Testing Examples
 * Demonstrates visual regression testing with Playwright
 */
test.describe('Visual Regression Tests', () => {
  test('should match homepage screenshot', async ({ page }, testInfo) => {
    Logger.step(1, 'Navigate to homepage');
    await page.goto('/');

    Logger.step(2, 'Take screenshot and compare');
    await expect(
      comparePageWithSnapshot(page, testInfo, {
        snapshotName: SNAPSHOT_FILES.homepage,
        maxDiffRatio: getVisualAllowance(testInfo.project.name, 'homepage'),
        maxDimensionMismatchRatio: getDimensionMismatchTolerance(testInfo.project.name, 'homepage'),
        screenshotOptions: { fullPage: true },
      })
    ).resolves.toBeUndefined();
  });

  test('should match specific element screenshot', async ({ page }, testInfo) => {
    Logger.step(1, 'Navigate to page');
    await page.goto('/');

    Logger.step(2, 'Take element screenshot');
    const header = page.locator('header').first();
    const headerBoundingBox = await getBoundingBoxOrFail(header, 'header');
    await expect(
      comparePageWithSnapshot(page, testInfo, {
        snapshotName: SNAPSHOT_FILES.header,
        maxDiffRatio: getVisualAllowance(testInfo.project.name, 'header'),
        maxDimensionMismatchRatio: getDimensionMismatchTolerance(testInfo.project.name, 'header'),
        screenshotOptions: {
          clip: headerBoundingBox,
        },
      })
    ).resolves.toBeUndefined();
  });

  test('should match screenshot with custom viewport', async ({ page }, testInfo) => {
    Logger.step(1, 'Set custom viewport');
    await page.setViewportSize({ width: 1920, height: 1080 });

    Logger.step(2, 'Navigate and capture');
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // eslint-disable-line playwright/no-wait-for-timeout -- give hero animation a moment to settle for consistent snapshots
    await expect(
      comparePageWithSnapshot(page, testInfo, {
        snapshotName: SNAPSHOT_FILES.desktop,
        maxDiffRatio: getVisualAllowance(testInfo.project.name, 'desktop'),
        maxDimensionMismatchRatio: getDimensionMismatchTolerance(testInfo.project.name, 'desktop'),
        screenshotOptions: { fullPage: true },
      })
    ).resolves.toBeUndefined();
  });

  test('should match mobile viewport screenshot', async ({ page }, testInfo) => {
    Logger.step(1, 'Set mobile viewport');
    await page.setViewportSize({ width: 375, height: 667 });

    Logger.step(2, 'Navigate and capture mobile view');
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(
      comparePageWithSnapshot(page, testInfo, {
        snapshotName: SNAPSHOT_FILES.mobile,
        maxDiffRatio: getVisualAllowance(testInfo.project.name, 'mobile'),
        maxDimensionMismatchRatio: getDimensionMismatchTolerance(testInfo.project.name, 'mobile'),
        screenshotOptions: { fullPage: true },
      })
    ).resolves.toBeUndefined();
  });

  test('should detect visual differences', async ({ page }, testInfo) => {
    Logger.step(1, 'Navigate to page');
    await page.goto('/');

    Logger.step(2, 'Take masked screenshot (hide dynamic content)');
    await expect(
      comparePageWithSnapshot(page, testInfo, {
        snapshotName: SNAPSHOT_FILES.masked,
        maxDiffRatio: getVisualAllowance(testInfo.project.name, 'masked'),
        maxDimensionMismatchRatio: getDimensionMismatchTolerance(testInfo.project.name, 'masked'),
        screenshotOptions: {
          fullPage: true,
        },
        mask: [page.locator('.dynamic-content')],
      })
    ).resolves.toBeUndefined();
  });
});
