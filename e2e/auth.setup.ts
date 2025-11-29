import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

// E2E test credentials - create this user in Supabase dashboard first
const TEST_EMAIL = process.env.E2E_TEST_EMAIL ?? "test@example.com";
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD ?? "testpassword123";

setup("authenticate", async ({ page }) => {
	console.log("Using email:", TEST_EMAIL);

	// Navigate to login page
	await page.goto("/login");

	// Fill in credentials
	await page.fill('input[name="email"]', TEST_EMAIL);
	await page.fill('input[name="password"]', TEST_PASSWORD);

	// Click sign in
	await page.click('button[type="submit"]');

	// Wait a bit for the response
	await page.waitForTimeout(2000);

	// Check for error message
	const errorMessage = page.locator(".bg-red-500\\/20");
	if (await errorMessage.isVisible()) {
		const errorText = await errorMessage.textContent();
		console.log("Login error:", errorText);
		throw new Error(`Login failed: ${errorText}`);
	}

	// Wait for redirect to home page with "View Posts" link
	await expect(page.locator('a:has-text("View Posts")')).toBeVisible({
		timeout: 10000,
	});

	// Save authentication state
	await page.context().storageState({ path: authFile });
	console.log("Authentication state saved to", authFile);
});
