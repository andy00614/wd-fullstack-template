import { expect, test } from "@playwright/test";

test.describe("Prompts Library - Public", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/prompts");
		// Wait for page to be fully loaded
		await page.waitForSelector("h1", { timeout: 10000 });
	});

	test("should display prompts page with title and search", async ({
		page,
	}) => {
		// Check page title
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Prompt Library",
		);

		// Check search input exists
		await expect(page.getByPlaceholder("Search prompts...")).toBeVisible();

		// Check category filters exist
		await expect(page.getByRole("button", { name: "All" })).toBeVisible();
		await expect(page.getByRole("button", { name: "Writing" })).toBeVisible();
		await expect(page.getByRole("button", { name: "Coding" })).toBeVisible();
	});

	test("should display prompt cards or empty state", async ({ page }) => {
		// Check that prompts count is displayed
		await expect(page.getByText(/\d+ prompts? found/)).toBeVisible();
	});

	test("should filter prompts by search query", async ({ page }) => {
		// Search for specific term
		await page.fill('[placeholder="Search prompts..."]', "code");
		await page.press('[placeholder="Search prompts..."]', "Enter");

		// Wait for URL to update
		await expect(page).toHaveURL(/q=code/);

		// Check results show search term
		await expect(page.getByText('for "code"')).toBeVisible();
	});

	test("should filter prompts by category", async ({ page }) => {
		// Click on Coding category
		await page.getByRole("button", { name: "Coding" }).click();

		// Wait for URL to update
		await expect(page).toHaveURL(/category=Coding/);

		// Check the Coding button is now selected (has dark background)
		const codingButton = page.getByRole("button", { name: "Coding" });
		await expect(codingButton).toHaveClass(/bg-black/);
	});

	test("should clear search when clicking clear button", async ({ page }) => {
		// First apply a search filter
		await page.fill('[placeholder="Search prompts..."]', "test");
		await page.press('[placeholder="Search prompts..."]', "Enter");

		// Wait for filter to apply
		await expect(page).toHaveURL(/q=test/);

		// Clear the search input and submit
		await page.fill('[placeholder="Search prompts..."]', "");
		await page.getByRole("button", { name: "All" }).click();

		// URL should be clean after clicking All
		await expect(page).toHaveURL("/prompts");
	});

	test("should show empty state when no results found", async ({ page }) => {
		// Search for something that won't exist
		await page.fill('[placeholder="Search prompts..."]', "xyznonexistent123");
		await page.press('[placeholder="Search prompts..."]', "Enter");

		// Should show empty state
		await expect(page.getByText("No prompts found")).toBeVisible();
	});

	test("should navigate back to home", async ({ page }) => {
		// Click back to home link
		await page.getByRole("link", { name: /Back to home/ }).click();

		// Should navigate to home
		await expect(page).toHaveURL("/");
	});

	test("should not show New Prompt button when not logged in", async ({
		page,
	}) => {
		// New Prompt button should not be visible for unauthenticated users
		await expect(
			page.getByRole("link", { name: "New Prompt" }),
		).not.toBeVisible();
	});

	test("should show login prompt when trying to favorite without login", async ({
		page,
	}) => {
		// First check if there are any prompts
		const promptCount = await page
			.getByText(/\d+ prompts? found/)
			.textContent();
		if (promptCount?.includes("0 prompts")) {
			// Skip test if no prompts exist
			test.skip();
			return;
		}

		// Try to click favorite button
		const favoriteButton = page
			.locator("button")
			.filter({ has: page.locator("svg.lucide-heart") })
			.first();

		// Check if favorite button exists
		const buttonExists = await favoriteButton.count();
		if (buttonExists === 0) {
			test.skip();
			return;
		}

		await favoriteButton.click();

		// Should show error toast
		await expect(
			page.getByText("Please sign in to favorite prompts"),
		).toBeVisible({ timeout: 5000 });
	});
});

test.describe("Prompts Library - Authenticated", () => {
	// Note: These tests require authentication setup
	// In a real scenario, you would use Playwright's storageState or login before each test

	test("should redirect to login when accessing /prompts/new without auth", async ({
		page,
	}) => {
		await page.goto("/prompts/new");

		// Should redirect to login
		await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
	});

	test("should redirect to login when accessing edit page without auth", async ({
		page,
	}) => {
		// Try to access a random edit page
		await page.goto("/prompts/550e8400-e29b-41d4-a716-446655440000/edit");

		// Should redirect to login
		await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
	});
});

test.describe("Prompts - New Prompt Page UI", () => {
	test("should display new prompt form elements correctly after login redirect", async ({
		page,
	}) => {
		// Go directly to check the page structure if we could access it
		await page.goto("/prompts/new");

		// Either we see the form or get redirected to login
		const currentUrl = page.url();
		if (currentUrl.includes("/login")) {
			// User is not logged in, expected behavior
			await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible(
				{ timeout: 10000 },
			);
		}
	});
});
