import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

/**
 * Extended test fixtures with page objects
 * This makes page objects available in all tests
 */
type MyFixtures = {
  homePage: HomePage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect } from '@playwright/test';
