---
name: webapp-testing
description: Test local web applications using Playwright. Use for UI verification, form testing, screenshot capture, and E2E test writing. Integrates with project's existing Playwright setup.
---

# Web Application Testing

Toolkit for testing local web applications using Playwright.

## Quick Start

```bash
# Run E2E tests
bun run e2e

# Run with UI mode (interactive)
bun run e2e:ui

# Run specific test file
bunx playwright test e2e/auth.spec.ts

# Take a screenshot
bun run screenshot http://localhost:3000/dashboard
```

## Writing E2E Tests

### Basic Test Structure

```typescript
// e2e/posts.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Posts', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: navigate to page
    await page.goto('/posts');
    await page.waitForLoadState('networkidle');
  });

  test('displays post list', async ({ page }) => {
    // Verify content loads
    await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
    await expect(page.getByTestId('post-list')).toBeVisible();
  });

  test('can create new post', async ({ page }) => {
    // Click create button
    await page.getByRole('button', { name: 'New Post' }).click();

    // Fill form
    await page.getByLabel('Title').fill('Test Post');
    await page.getByLabel('Content').fill('Test content');

    // Submit
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify success
    await expect(page.getByText('Post created')).toBeVisible();
  });
});
```

### Selector Priorities

Use in this order (most to least reliable):

1. **Role** - `getByRole('button', { name: 'Submit' })`
2. **Label** - `getByLabel('Email')`
3. **Text** - `getByText('Welcome')`
4. **Test ID** - `getByTestId('submit-btn')`
5. **CSS** - `page.locator('.submit-button')` (last resort)

```typescript
// GOOD: Semantic selectors
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('test@example.com');
await page.getByRole('link', { name: 'Dashboard' }).click();

// BAD: Brittle selectors
await page.locator('#btn-123').click();
await page.locator('.form-control:nth-child(2)').fill('test');
```

### Waiting Strategies

```typescript
// Wait for network to settle (dynamic apps)
await page.waitForLoadState('networkidle');

// Wait for specific element
await page.waitForSelector('[data-testid="loaded"]');

// Wait for response
await page.waitForResponse(resp =>
  resp.url().includes('/api/posts') && resp.status() === 200
);

// Explicit wait (avoid if possible)
await page.waitForTimeout(1000);
```

### Authentication

```typescript
// e2e/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for auth to complete
  await page.waitForURL('/dashboard');

  // Save auth state
  await page.context().storageState({ path: authFile });
});

// In other tests, use the auth state
test.use({ storageState: authFile });
```

### Form Testing

```typescript
test('validates form inputs', async ({ page }) => {
  await page.goto('/register');

  // Submit empty form
  await page.getByRole('button', { name: 'Register' }).click();

  // Check validation errors
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();

  // Fill with invalid data
  await page.getByLabel('Email').fill('invalid-email');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByText('Invalid email format')).toBeVisible();

  // Fill with valid data
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('securepassword123');
  await page.getByRole('button', { name: 'Register' }).click();

  // Verify success
  await expect(page).toHaveURL('/dashboard');
});
```

### Visual Testing

```typescript
test('matches visual snapshot', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Full page screenshot
  await expect(page).toHaveScreenshot('dashboard.png');

  // Element screenshot
  await expect(page.getByTestId('chart')).toHaveScreenshot('chart.png');
});
```

## Testing Patterns

### Page Object Model

```typescript
// e2e/pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// Usage in test
test('can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### API Mocking

```typescript
test('handles API error gracefully', async ({ page }) => {
  // Mock failed API response
  await page.route('**/api/posts', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' }),
    });
  });

  await page.goto('/posts');

  // Verify error state is shown
  await expect(page.getByText('Failed to load posts')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});
```

## Test Organization

```
e2e/
├── auth.setup.ts           # Authentication setup
├── auth.spec.ts            # Auth flow tests
├── posts.spec.ts           # Posts feature tests
├── dashboard.spec.ts       # Dashboard tests
├── pages/                  # Page objects
│   ├── login.page.ts
│   └── dashboard.page.ts
└── fixtures/               # Test data
    └── posts.json
```

## Debugging Tips

```bash
# Run with headed browser
bunx playwright test --headed

# Run with debug mode (step through)
bunx playwright test --debug

# Generate test from actions
bunx playwright codegen http://localhost:3000

# View test report
bunx playwright show-report
```

## Checklist Before Merging

- [ ] All E2E tests pass locally
- [ ] Tests cover happy path
- [ ] Tests cover error states
- [ ] Tests don't depend on specific data
- [ ] Tests clean up after themselves
- [ ] No hardcoded waits (`waitForTimeout`)
- [ ] Using semantic selectors
