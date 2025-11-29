import { expect, test } from "@playwright/test";

test.describe("Posts CRUD Performance", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to posts page - assumes user is already logged in
		// You may need to set up authentication state first
		await page.goto("/posts");
	});

	test("measure create post performance", async ({ page }) => {
		const iterations = 5;
		const timings: number[] = [];

		for (let i = 0; i < iterations; i++) {
			// Fill in the form
			await page.fill('input[name="title"]', `Performance Test ${i + 1}`);
			await page.fill(
				'textarea[name="content"]',
				`Content for performance test ${i + 1}`,
			);

			// Click create and wait for timing to appear
			await page.click('button[type="submit"]');

			// Wait for the timing badge to appear
			const totalBadge = page.locator("text=/Total: [\\d.]+ms/");
			await expect(totalBadge).toBeVisible({ timeout: 10000 });

			// Extract the timing value
			const text = await totalBadge.textContent();
			const match = text?.match(/Total: ([\d.]+)ms/);
			if (match?.[1]) {
				timings.push(parseFloat(match[1]));
			}

			// Small delay between iterations
			await page.waitForTimeout(500);
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
		expect(avg).toBeLessThan(200); // Average should be under 200ms
	});

	test("measure delete post performance", async ({ page }) => {
		// First create a few posts to delete
		const postsToCreate = 3;

		for (let i = 0; i < postsToCreate; i++) {
			await page.fill('input[name="title"]', `Delete Test ${i + 1}`);
			await page.fill('textarea[name="content"]', `To be deleted ${i + 1}`);
			await page.click('button[type="submit"]');
			await page.waitForTimeout(1000);
		}

		// Now measure delete performance by counting posts before/after
		const timings: number[] = [];

		for (let i = 0; i < postsToCreate; i++) {
			const deleteButtons = page.locator('button:has-text("Delete")');
			const countBefore = await deleteButtons.count();

			if (countBefore === 0) break;

			// Click delete on the first available post
			const startTime = Date.now();
			await deleteButtons.first().click();

			// Wait for the post to be deleted (button count decreases)
			await expect(deleteButtons).toHaveCount(countBefore - 1, {
				timeout: 10000,
			});
			const duration = Date.now() - startTime;
			timings.push(duration);

			await page.waitForTimeout(300);
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

			expect(avg).toBeLessThan(500); // Client-side timing includes network latency
		}
	});
});
