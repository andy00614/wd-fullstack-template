import { expect, test } from "@playwright/test";

test.describe("Posts CRUD Performance", () => {
	// Performance tests need more time
	test.setTimeout(60000);

	test.beforeEach(async ({ page }) => {
		await page.goto("/posts");
		// Wait for page to be fully loaded
		await page.waitForSelector('[data-slot="card"]', { timeout: 10000 });
	});

	test("measure create post performance", async ({ page }) => {
		const iterations = 5;
		const timings: number[] = [];

		for (let i = 0; i < iterations; i++) {
			// Fill in the form
			await page.fill('input[name="title"]', `Performance Test ${Date.now()}`);
			await page.fill(
				'textarea[name="content"]',
				`Content for performance test ${i + 1}`,
			);

			// Click create and wait for toast to appear
			await page.click('button[type="submit"]');

			// Wait for the latest toast notification with timing
			const toast = page.locator("[data-sonner-toast]").first();
			await expect(toast).toBeVisible({ timeout: 10000 });

			// Extract the timing value from toast (e.g., "Post created in 159.70ms")
			const text = await toast.textContent();
			const match = text?.match(/in ([\d.]+)ms/);
			if (match?.[1]) {
				timings.push(parseFloat(match[1]));
			}

			// Wait for toast to disappear
			await page.waitForTimeout(2000);
		}

		// Calculate statistics
		const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
		const sorted = [...timings].sort((a, b) => a - b);
		const p95 = sorted[Math.floor(sorted.length * 0.95)];
		const min = Math.min(...timings);
		const max = Math.max(...timings);

		console.log("\n=== Create Post Performance Results ===");
		console.log(`Iterations: ${iterations}`);
		console.log(`Timings: ${timings.map((t) => t.toFixed(2)).join("ms, ")}ms`);
		console.log(`Average: ${avg.toFixed(2)}ms`);
		console.log(`Min: ${min.toFixed(2)}ms`);
		console.log(`Max: ${max.toFixed(2)}ms`);
		console.log(`P95: ${p95?.toFixed(2)}ms`);
		console.log("=====================================\n");

		// Assert performance is within acceptable range
		expect(avg).toBeLessThan(500);
	});

	test("measure delete post performance", async ({ page }) => {
		// First create a few posts to delete
		const postsToCreate = 3;
		const createdTitles: string[] = [];

		for (let i = 0; i < postsToCreate; i++) {
			const title = `Delete Perf ${Date.now()}`;
			createdTitles.push(title);
			await page.fill('input[name="title"]', title);
			await page.fill('textarea[name="content"]', `To be deleted ${i + 1}`);
			await page.click('button[type="submit"]');
			await expect(page.locator("[data-sonner-toast]").first()).toBeVisible({
				timeout: 10000,
			});
			await page.waitForTimeout(2000);
		}

		// Now measure delete performance
		const timings: number[] = [];

		for (const title of createdTitles) {
			const card = page
				.locator('[data-slot="card"]')
				.filter({ hasText: title });

			if ((await card.count()) === 0) continue;

			// Click delete
			await card.getByRole("button").last().click();

			// Wait for toast with timing
			const toast = page.locator("[data-sonner-toast]").first();
			await expect(toast).toBeVisible({ timeout: 10000 });

			const text = await toast.textContent();
			const match = text?.match(/in ([\d.]+)ms/);
			if (match?.[1]) {
				timings.push(parseFloat(match[1]));
			}

			await page.waitForTimeout(2000);
		}

		if (timings.length > 0) {
			const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
			console.log("\n=== Delete Post Performance Results ===");
			console.log(`Iterations: ${timings.length}`);
			console.log(
				`Timings: ${timings.map((t) => t.toFixed(2)).join("ms, ")}ms`,
			);
			console.log(`Average: ${avg.toFixed(2)}ms`);
			console.log("=====================================\n");

			expect(avg).toBeLessThan(500);
		}
	});
});
