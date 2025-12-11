# Quick Start Guide

Get up and running with this Playwright framework in minutes!

## 🚀 5-Minute Setup

### 1. Install Dependencies

```bash
npm install
npx playwright install --with-deps
```

### 2. Run Your First Test

```bash
npm test
```

### 3. View the Report

```bash
npm run report
```

## 📝 Creating Your First Test

### Option 1: Record a Test (Easiest)

```bash
npm run codegen https://example.com
```

This opens a browser where you can interact with the site. Playwright records your actions and generates test code!

### Option 2: Write a Test Manually

Create a new file in `tests/e2e/my-test.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('my first test', async ({ page }) => {
  // Navigate to a page
  await page.goto('https://example.com');

  // Check the title
  await expect(page).toHaveTitle(/Example/);

  // Click a button
  await page.click('text=More information');

  // Verify URL changed
  expect(page.url()).toContain('iana.org');
});
```

### Option 3: Use Page Objects

Create a page object in `tests/pages/MyPage.ts`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  readonly loginButton = this.page.getByRole('button', { name: 'Login' });

  constructor(page: Page) {
    super(page);
  }

  async clickLogin() {
    await this.clickElement(this.loginButton);
  }
}
```

Use it in your test:

```typescript
import { test, expect } from '@playwright/test';
import { MyPage } from '../pages/MyPage';

test('use page object', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.goto('/');
  await myPage.clickLogin();
});
```

## 🎯 Common Commands

```bash
# Run all tests
npm test

# Run with UI (best for debugging)
npm run test:ui

# Run specific test file
npx playwright test tests/e2e/my-test.spec.ts

# Run in headed mode (see browser)
npm run test:headed

# Run on specific browser
npm run test:chromium
npm run test:firefox

# Debug mode (step through tests)
npm run test:debug

# Generate code from browser interactions
npm run codegen
```

## 🔍 Debugging Tips

### 1. Use UI Mode (Recommended)

```bash
npm run test:ui
```

This gives you a GUI to:

- See your tests
- Watch them run step by step
- Inspect DOM at each step
- Debug failures easily

### 2. Use Debug Mode

```bash
npm run test:debug
```

### 3. Add Screenshots/Videos

Add this to your test:

```typescript
test('my test', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'screenshot.png' });
});
```

### 4. Use Playwright Inspector

Add `await page.pause();` in your test to pause execution:

```typescript
test('debug test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Pauses here - use inspector to debug
  await page.click('button');
});
```

## 🌍 Environment Setup

### Development

```bash
cp .env.example .env
```

Edit `.env`:

```
BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Different Environments

```bash
# Test against staging
BASE_URL=https://staging.example.com npm test

# Test against production
BASE_URL=https://example.com npm test
```

## 📊 Viewing Results

### HTML Report (Best)

```bash
npm run report
```

Opens an interactive HTML report showing:

- Pass/fail status
- Screenshots
- Videos
- Traces
- Timing information

### Terminal Output

Tests show results in terminal by default with:

- ✓ for passed tests
- ✗ for failed tests
- Timing information
- Error details

## 🎨 Code Quality

### Before Committing

```bash
# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test
```

### Automatic Formatting

Install recommended VS Code extensions and code will auto-format on save!

## 🐳 Docker (Optional)

Build and run tests in Docker:

```bash
docker build -t playwright-tests .
docker run -it playwright-tests
```

## 📚 Next Steps

1. ✅ Explore example tests in `tests/e2e/`
2. ✅ Check out API tests in `tests/api/`
3. ✅ Review Page Objects in `tests/pages/`
4. ✅ Read the full [README.md](README.md)
5. ✅ Check [Playwright Docs](https://playwright.dev/docs/intro)

## ❓ Common Issues

### Browsers not installed?

```bash
npx playwright install --with-deps
```

### Tests failing on CI?

- Check `.github/workflows/playwright.yml`
- Ensure BASE_URL is set correctly
- Check browser compatibility

### Need help?

- Open an issue
- Check Playwright docs
- Join Playwright Discord

---

Happy testing! 🎭
