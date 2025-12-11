# Setup Guide - Playwright Framework Starter Kit

This guide will walk you through setting up and customizing this Playwright testing framework for your project.

## 🎯 Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/MusabRehman03/Playwright-Framework.git my-project-tests

# Navigate to directory
cd my-project-tests

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

### 2. Configure Your Project

#### Update package.json

Edit `package.json` to match your project:

```json
{
  "name": "my-project-tests",
  "version": "1.0.0",
  "description": "E2E tests for My Project",
  "author": "Your Name",
  ...
}
```

#### Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env
```

Update these values:

```env
BASE_URL=https://your-app.com
API_URL=https://api.your-app.com
NODE_ENV=development
```

#### Update Playwright Config

Edit `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL || 'https://your-app.com',
    // ... other settings
  },
});
```

## 📝 Creating Your First Test

### Option 1: Generate Tests with Codegen

```bash
# Start codegen with your app URL
npm run codegen https://your-app.com

# Interact with your app
# Playwright records your actions
# Copy generated code to a test file
```

### Option 2: Write Tests Manually

Create `tests/e2e/login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## 🏗️ Creating Page Objects

### 1. Create a New Page Object

Create `tests/pages/LoginPage.ts`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async navigate() {
    await this.goto('/login');
  }

  async login(email: string, password: string) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.getElementText(this.errorMessage);
  }
}
```

### 2. Add to Fixtures

Update `tests/fixtures/baseFixtures.ts`:

```typescript
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

type MyFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
```

### 3. Use in Tests

```typescript
import { test, expect } from '../fixtures/baseFixtures';

test('login with page object', async ({ loginPage }) => {
  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password123');
  // ... assertions
});
```

## 🔧 Customizing Configuration

### Multiple Environments

Create environment-specific configs:

```typescript
// tests/config/env.config.ts
const environments = {
  dev: {
    baseURL: 'http://localhost:3000',
    apiURL: 'http://localhost:3001/api',
  },
  staging: {
    baseURL: 'https://staging.myapp.com',
    apiURL: 'https://staging.myapp.com/api',
  },
  production: {
    baseURL: 'https://myapp.com',
    apiURL: 'https://api.myapp.com',
  },
};
```

Run tests against different environments:

```bash
NODE_ENV=staging npm test
NODE_ENV=production npm test
```

### Custom Test Tags

Add tags to tests:

```typescript
test('important test @smoke @critical', async ({ page }) => {
  // test code
});
```

Run specific tags:

```bash
npx playwright test --grep @smoke
npx playwright test --grep-invert @slow
```

## 🚀 CI/CD Setup

### GitHub Actions (Already Configured)

The framework includes workflows in `.github/workflows/`:

- `playwright.yml` - Runs tests on push/PR
- `lint.yml` - Runs linting checks

### Customize for Your Needs

Edit `.github/workflows/playwright.yml`:

```yaml
# Add environment variables
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}

# Add deployment integration
- name: Deploy if tests pass
  if: success()
  run: npm run deploy
```

### Add Secrets

In GitHub repository settings:

1. Go to Settings → Secrets and variables → Actions
2. Add secrets:
   - `BASE_URL`
   - `API_KEY`
   - etc.

## 🧪 Test Data Management

### Using Test Data Generator

```typescript
import { TestDataGenerator } from '../utils/TestDataGenerator';

test('create user with random data', async ({ page }) => {
  const email = TestDataGenerator.generateEmail('testuser');
  const password = TestDataGenerator.generatePassword();
  const phone = TestDataGenerator.generatePhoneNumber();

  // Use in test
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
});
```

### External Test Data

Create `tests/data/users.json`:

```json
{
  "validUser": {
    "email": "user@example.com",
    "password": "Test123!"
  },
  "adminUser": {
    "email": "admin@example.com",
    "password": "Admin123!"
  }
}
```

Use in tests:

```typescript
import users from '../data/users.json';

test('login as valid user', async ({ page }) => {
  await page.fill('[name="email"]', users.validUser.email);
  await page.fill('[name="password"]', users.validUser.password);
});
```

## 🔐 Authentication Setup

### Save Auth State

Create `tests/auth.setup.ts`:

```typescript
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // Save auth state
  await page.context().storageState({ path: authFile });
});
```

Update `playwright.config.ts`:

```typescript
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

## 📊 Reporting

### View HTML Report

```bash
npm run report
```

### Integrate with CI/CD

Reports are automatically generated and uploaded as artifacts in CI.

### Custom Reporters

Add to `playwright.config.ts`:

```typescript
reporter: [
  ['html'],
  ['json', { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
  ['./custom-reporter.ts'], // Your custom reporter
];
```

## 🐛 Debugging Tips

### Use UI Mode

```bash
npm run test:ui
```

Best for:

- Watching tests run
- Stepping through tests
- Inspecting DOM
- Time-travel debugging

### Debug Mode

```bash
npm run test:debug
```

### VS Code Debugging

1. Install "Playwright Test for VSCode" extension
2. Set breakpoints in tests
3. Click "Debug Test" in the editor
4. Or use the provided launch configuration

## 📱 Mobile Testing

### Test Specific Mobile Devices

```typescript
test.use({
  ...devices['iPhone 12'],
});

test('mobile test', async ({ page }) => {
  // Test runs on iPhone 12 viewport
});
```

### Custom Mobile Config

```typescript
test.use({
  viewport: { width: 375, height: 667 },
  isMobile: true,
  hasTouch: true,
  userAgent: 'custom user agent',
});
```

## 🎨 Visual Regression Testing

### Create Baseline Screenshots

```bash
# Run tests to create baseline
npm test -- tests/visual/

# Baselines saved in tests/visual/*.spec.ts-snapshots/
```

### Update Baselines

```bash
# Update all baselines
npx playwright test --update-snapshots

# Update specific test
npx playwright test tests/visual/homepage.spec.ts --update-snapshots
```

## 🔄 Parallel Execution

### Configure Workers

In `playwright.config.ts`:

```typescript
export default defineConfig({
  workers: process.env.CI ? 1 : 4, // 4 parallel workers locally
});
```

### Control at Runtime

```bash
# Use 2 workers
npx playwright test --workers=2

# Run serially
npx playwright test --workers=1
```

## 📦 Docker Usage

### Build Image

```bash
docker build -t my-playwright-tests .
```

### Run Tests

```bash
# Run all tests
docker run -it my-playwright-tests

# Run specific tests
docker run -it my-playwright-tests npx playwright test tests/e2e/

# With environment variables
docker run -it -e BASE_URL=https://staging.com my-playwright-tests
```

## 🎓 Next Steps

1. ✅ Remove example tests from `tests/e2e/example.spec.ts`
2. ✅ Create page objects for your application
3. ✅ Write your first real test
4. ✅ Set up authentication
5. ✅ Configure CI/CD secrets
6. ✅ Customize GitHub Actions workflow
7. ✅ Add test data
8. ✅ Create custom utilities as needed
9. ✅ Document your testing conventions
10. ✅ Train your team

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Community Discord](https://discord.com/invite/playwright)
- [GitHub Discussions](https://github.com/microsoft/playwright/discussions)

## 🆘 Troubleshooting

### Browsers Not Installing

```bash
# Install with dependencies
npx playwright install --with-deps

# Or install system dependencies separately
npx playwright install-deps
npx playwright install
```

### Tests Timing Out

- Increase timeout in `playwright.config.ts`
- Check network conditions
- Look for race conditions
- Use proper waits

### Flaky Tests

- Use auto-waiting features
- Avoid hard waits
- Use proper assertions
- Enable retries for CI

### CI Failures

- Check environment variables
- Verify BASE_URL is set
- Review CI logs
- Check browser installation

---

Need more help? Check the [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md)!
