# Playwright Testing Framework - Starter Kit

A comprehensive, production-ready Playwright testing framework boilerplate with best practices, proper folder structure, CI/CD integration, and code quality tools.

## 🚀 Features

- ✅ **TypeScript Support** - Full TypeScript configuration for type safety
- ✅ **Page Object Model (POM)** - Well-structured page objects for maintainability
- ✅ **Custom Fixtures** - Reusable test fixtures and helpers
- ✅ **Multiple Test Types** - E2E, API, and Visual testing examples
- ✅ **CI/CD Ready** - GitHub Actions workflows included
- ✅ **Code Quality** - ESLint and Prettier pre-configured
- ✅ **Test Reports** - HTML, JSON, and JUnit report generation
- ✅ **Cross-Browser Testing** - Chromium, Firefox, and WebKit support
- ✅ **Mobile Testing** - Mobile viewport configurations
- ✅ **Parallel Execution** - Tests run in parallel for faster execution
- ✅ **Retry Logic** - Automatic retries on CI for flaky tests
- ✅ **Screenshots & Videos** - Capture on failure for debugging
- ✅ **Environment Configuration** - Easy environment management

## 📁 Project Structure

```
Playwright-Framework/
├── .github/
│   └── workflows/          # CI/CD workflows
│       ├── playwright.yml  # Main test workflow
│       └── lint.yml        # Linting workflow
├── tests/
│   ├── api/               # API test cases
│   ├── e2e/               # End-to-end test cases
│   ├── visual/            # Visual regression tests
│   ├── pages/             # Page Object Models
│   │   ├── BasePage.ts    # Base page class
│   │   └── HomePage.ts    # Example page object
│   ├── fixtures/          # Custom test fixtures
│   │   └── baseFixtures.ts
│   ├── utils/             # Utility functions
│   │   ├── Logger.ts      # Logging utility
│   │   ├── TestDataGenerator.ts
│   │   └── helpers.ts
│   └── config/            # Test configurations
│       └── env.config.ts  # Environment config
├── screenshots/           # Test screenshots
├── .env.example          # Environment variables template
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── .gitignore            # Git ignore rules
├── playwright.config.ts  # Playwright configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MusabRehman03/Playwright-Framework.git
   cd Playwright-Framework
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Playwright browsers:**

   ```bash
   npx playwright install --with-deps
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🎯 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run tests for specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile
```

### Viewing Reports

```bash
# Show HTML report
npm run report
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Code Generation

```bash
# Use Playwright codegen to record tests
npm run codegen
```

## 📝 Writing Tests

### Basic Test Example

```typescript
import { test, expect } from '@playwright/test';

test('basic test example', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

### Using Page Objects

```typescript
import { test, expect } from '../fixtures/baseFixtures';

test('test with page object', async ({ homePage }) => {
  await homePage.navigate();
  const heading = await homePage.getMainHeading();
  expect(heading).toBeTruthy();
});
```

### API Testing

```typescript
import { test, expect } from '@playwright/test';

test('API test example', async ({ request }) => {
  const response = await request.get('https://api.example.com/data');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data).toHaveProperty('id');
});
```

## 🔧 Configuration

### Playwright Configuration

Edit `playwright.config.ts` to customize:

- Test directory
- Timeouts
- Retries
- Reporters
- Browser projects
- Base URL
- Screenshots/videos settings

### Environment Configuration

Edit `.env` file or `tests/config/env.config.ts` for environment-specific settings:

- Base URLs
- API endpoints
- Timeouts
- Authentication credentials (use secure methods)

### ESLint & Prettier

- ESLint configuration: `.eslintrc.json`
- Prettier configuration: `.prettierrc.json`

## 🔄 CI/CD Integration

### GitHub Actions

The project includes two workflows:

1. **Playwright Tests** (`.github/workflows/playwright.yml`)
   - Runs on push and pull requests
   - Executes tests with sharding for parallel execution
   - Uploads test reports and results
   - Generates merged reports

2. **Lint Workflow** (`.github/workflows/lint.yml`)
   - Runs ESLint and Prettier checks
   - Ensures code quality standards

### Running in CI

The tests automatically run on:

- Push to `main`, `master`, or `develop` branches
- Pull requests to these branches
- Manual workflow dispatch

## 📊 Test Reports

Test reports are generated in multiple formats:

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`

View the HTML report:

```bash
npm run report
```

## 🎨 Best Practices

1. **Use Page Object Model** - Keep page logic separate from tests
2. **Write Descriptive Tests** - Use clear test names and descriptions
3. **Use Custom Fixtures** - Share common setup across tests
4. **Leverage Utilities** - Use helper functions for common tasks
5. **Handle Waits Properly** - Use auto-waiting features of Playwright
6. **Take Screenshots** - Capture state on failures
7. **Use API Testing** - Test APIs directly when possible
8. **Parallel Execution** - Run tests in parallel for speed
9. **Environment Variables** - Use env vars for configuration
10. **Code Quality** - Run linter and formatter regularly

## 🐛 Debugging

### Debug Mode

```bash
npm run test:debug
```

### UI Mode

```bash
npm run test:ui
```

### VS Code Debugging

Install the Playwright Test for VSCode extension for integrated debugging.

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - feel free to use this starter kit for your projects!

## 🙋 Support

For issues and questions:

- Create an issue in the repository
- Check Playwright documentation
- Join Playwright community on Discord

---

**Happy Testing! 🎭**
