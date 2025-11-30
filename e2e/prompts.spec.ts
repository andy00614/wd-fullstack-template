import { expect, test } from "@playwright/test";

test.describe("Prompts Library", () => {
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

	test("should display prompt cards", async ({ page }) => {
		// Check that prompts count is displayed
		await expect(page.getByText(/\d+ prompts? found/)).toBeVisible();

		// Check Copy buttons exist (one per card)
		const copyButtons = page.getByRole("button", { name: "Copy" });
		await expect(copyButtons.first()).toBeVisible({ timeout: 10000 });
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

	test("should copy prompt content to clipboard", async ({ page, context }) => {
		// Grant clipboard permissions
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);

		// Wait for copy buttons to be available
		const copyButton = page.getByRole("button", { name: "Copy" }).first();
		await expect(copyButton).toBeVisible({ timeout: 10000 });

		// Click Copy button
		await copyButton.click();

		// Should show success toast
		await expect(page.getByText("Prompt copied to clipboard")).toBeVisible({
			timeout: 5000,
		});
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
});
