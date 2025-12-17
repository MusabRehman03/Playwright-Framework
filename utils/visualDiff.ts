import { promises as fs } from 'fs';
import path from 'path';
import type { Locator, Page, PageScreenshotOptions, TestInfo } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

interface SnapshotDiffOptions {
  maxDiffRatio: number;
  maxDimensionMismatchRatio?: number;
  threshold?: number;
}

interface CompareOptions extends SnapshotDiffOptions {
  snapshotName: string;
  screenshotOptions?: PageScreenshotOptions;
  mask?: Locator[];
}

function cropTo(png: PNG, width: number, height: number): PNG {
  if (png.width === width && png.height === height) {
    return png;
  }

  const cropped = new PNG({ width, height });
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const srcIndex = (png.width * y + x) << 2;
      const destIndex = (width * y + x) << 2;
      cropped.data[destIndex] = png.data[srcIndex];
      cropped.data[destIndex + 1] = png.data[srcIndex + 1];
      cropped.data[destIndex + 2] = png.data[srcIndex + 2];
      cropped.data[destIndex + 3] = png.data[srcIndex + 3];
    }
  }

  return cropped;
}

async function loadBaselineSnapshot(testInfo: TestInfo, snapshotName: string): Promise<Buffer> {
  const directPath = testInfo.snapshotPath(snapshotName);
  try {
    await fs.access(directPath);
    return fs.readFile(directPath);
  } catch {
    // Fallback to project-scoped naming (e.g., homepage-chromium.png)
    const dirname = path.dirname(directPath);
    const ext = path.extname(snapshotName);
    const basename = path.basename(snapshotName, ext);
    const projectSpecific = path.join(dirname, `${basename}-${testInfo.project.name}${ext}`);
    return fs.readFile(projectSpecific);
  }
}

function computeDimensionMismatchRatio(actual: PNG, baseline: PNG): number {
  const widthDiff = Math.abs(actual.width - baseline.width) / baseline.width;
  const heightDiff = Math.abs(actual.height - baseline.height) / baseline.height;
  return Math.max(widthDiff, heightDiff);
}

function computeDiff(
  actual: PNG,
  baseline: PNG,
  threshold: number
): { diffRatio: number; diffImage: PNG } {
  const overlapWidth = Math.min(actual.width, baseline.width);
  const overlapHeight = Math.min(actual.height, baseline.height);
  const baselineTotalPixels = baseline.width * baseline.height;

  const actualCropped = cropTo(actual, overlapWidth, overlapHeight);
  const baselineCropped = cropTo(baseline, overlapWidth, overlapHeight);
  const diffImage = new PNG({ width: overlapWidth, height: overlapHeight });

  const diffPixels = pixelmatch(
    baselineCropped.data,
    actualCropped.data,
    diffImage.data,
    overlapWidth,
    overlapHeight,
    {
      threshold,
      includeAA: true,
    }
  );

  const missingPixels = baselineTotalPixels - overlapWidth * overlapHeight;
  const totalDifference = diffPixels + Math.max(0, missingPixels);
  const diffRatio = baselineTotalPixels === 0 ? 0 : totalDifference / baselineTotalPixels;

  return { diffRatio, diffImage };
}

export async function comparePageWithSnapshot(
  page: Page,
  testInfo: TestInfo,
  options: CompareOptions
): Promise<void> {
  const {
    snapshotName,
    screenshotOptions,
    mask,
    maxDiffRatio,
    maxDimensionMismatchRatio = 0.02,
    threshold = 0.1,
  } = options;

  const screenshot = await page.screenshot({ ...screenshotOptions, mask });
  const baselineBuffer = await loadBaselineSnapshot(testInfo, snapshotName);

  const actualPng = PNG.sync.read(screenshot);
  const baselinePng = PNG.sync.read(baselineBuffer);

  const dimensionMismatchRatio = computeDimensionMismatchRatio(actualPng, baselinePng);
  if (dimensionMismatchRatio > maxDimensionMismatchRatio) {
    await testInfo.attach('actual', { body: screenshot, contentType: 'image/png' });
    await testInfo.attach('baseline', { body: baselineBuffer, contentType: 'image/png' });
    throw new Error(
      `Snapshot dimensions diverged beyond ${maxDimensionMismatchRatio * 100}% (width: ${actualPng.width}x height: ${actualPng.height}) vs baseline (${baselinePng.width}x${baselinePng.height}).`
    );
  }

  const { diffRatio, diffImage } = computeDiff(actualPng, baselinePng, threshold);

  if (diffRatio > maxDiffRatio) {
    await testInfo.attach('actual', { body: screenshot, contentType: 'image/png' });
    await testInfo.attach('baseline', { body: baselineBuffer, contentType: 'image/png' });
    await testInfo.attach('diff', {
      body: PNG.sync.write(diffImage),
      contentType: 'image/png',
    });
    throw new Error(
      `Snapshot difference ratio ${diffRatio.toFixed(4)} exceeded tolerance ${maxDiffRatio.toFixed(4)} for ${snapshotName}.`
    );
  }
}
