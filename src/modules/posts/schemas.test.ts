import { describe, expect, it } from "vitest";
import { postSchema } from "./schemas";

describe("postSchema", () => {
	it("validates a valid post with title and content", () => {
		const result = postSchema.safeParse({
			title: "My Post",
			content: "Some content",
		});
		expect(result.success).toBe(true);
	});

	it("validates a post with only title", () => {
		const result = postSchema.safeParse({
			title: "My Post",
		});
		expect(result.success).toBe(true);
	});

	it("validates a post with empty content", () => {
		const result = postSchema.safeParse({
			title: "My Post",
			content: "",
		});
		expect(result.success).toBe(true);
	});

	it("rejects empty title", () => {
		const result = postSchema.safeParse({
			title: "",
			content: "Some content",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe("Title is required");
		}
	});

	it("rejects missing title", () => {
		const result = postSchema.safeParse({
			content: "Some content",
		});
		expect(result.success).toBe(false);
	});
});
