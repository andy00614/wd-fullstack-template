import { expect, test } from "@playwright/test";

test.describe("Posts CRUD", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/posts");
		// Wait for page to be fully loaded
		await page.waitForSelector('[data-slot="card"]', { timeout: 10000 });
	});

	test("should display new post immediately after creation", async ({
		page,
	}) => {
		const uniqueTitle = `Test Post ${Date.now()}`;
		const uniqueContent = `Content ${Date.now()}`;

		// Fill form
		await page.fill('input[name="title"]', uniqueTitle);
		await page.fill('textarea[name="content"]', uniqueContent);

		// Submit
		await page.click('button[type="submit"]');

		// Wait for toast to appear (indicates success)
		await expect(page.locator("[data-sonner-toast]").first()).toBeVisible({
			timeout: 10000,
		});

		// Verify post appears (increase timeout for refresh)
		await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });

		// Verify content is also visible within the card
		const card = page
			.locator(`[data-slot="card"]`)
			.filter({ hasText: uniqueTitle });
		await expect(card.getByText(uniqueContent)).toBeVisible();

		// Cleanup: delete the test post
		await card.getByRole("button").last().click();
		await expect(page.getByText(uniqueTitle)).not.toBeVisible({
			timeout: 10000,
		});
	});

	test("should show validation error for empty title", async ({ page }) => {
		// Try to submit without title
		await page.fill('textarea[name="content"]', "Some content");
		await page.click('button[type="submit"]');

		// Should show validation error
		await expect(page.getByText("Title is required")).toBeVisible();
	});

	test("should edit post successfully", async ({ page }) => {
		// First create a post
		const originalTitle = `Edit Test ${Date.now()}`;
		await page.fill('input[name="title"]', originalTitle);
		await page.click('button[type="submit"]');

		// Wait for post to appear
		await expect(page.getByText(originalTitle)).toBeVisible({ timeout: 10000 });

		// Click edit button
		const card = page
			.locator(`[data-slot="card"]`)
			.filter({ hasText: originalTitle });
		await card.getByRole("link", { name: "Edit" }).click();

		// Should navigate to edit page
		await expect(page).toHaveURL(/\/posts\/.*\/edit/);

		// Update the title
		const updatedTitle = `Updated ${Date.now()}`;
		await page.fill('input[name="title"]', updatedTitle);
		await page.click('button[type="submit"]');

		// Wait for toast and redirect
		await expect(page.locator("[data-sonner-toast]").first()).toBeVisible({
			timeout: 10000,
		});
		await expect(page).toHaveURL("/posts", { timeout: 10000 });

		// Verify updated title is visible
		await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 10000 });

		// Cleanup
		const updatedCard = page
			.locator(`[data-slot="card"]`)
			.filter({ hasText: updatedTitle });
		await updatedCard.getByRole("button").last().click();
	});

	test("should delete post successfully", async ({ page }) => {
		// Create a post to delete
		const titleToDelete = `Delete Test ${Date.now()}`;
		await page.fill('input[name="title"]', titleToDelete);
		await page.click('button[type="submit"]');

		// Wait for post to appear
		await expect(page.getByText(titleToDelete)).toBeVisible({ timeout: 10000 });

		// Delete the post
		const card = page
			.locator(`[data-slot="card"]`)
			.filter({ hasText: titleToDelete });
		await card.getByRole("button").last().click();

		// Verify post is removed
		await expect(page.getByText(titleToDelete)).not.toBeVisible({
			timeout: 10000,
		});
	});
});
