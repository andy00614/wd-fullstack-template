import { describe, expect, it } from "vitest";
import { promptSchema, searchPromptsSchema } from "./schemas";

describe("promptSchema", () => {
	it("validates a valid prompt with all fields", () => {
		const result = promptSchema.safeParse({
			title: "Test Prompt",
			content: "This is test content",
			category: "Writing",
			tags: ["test", "example"],
			author: "Test Author",
		});
		expect(result.success).toBe(true);
	});

	it("validates a prompt with empty tags array", () => {
		const result = promptSchema.safeParse({
			title: "Test Prompt",
			content: "This is test content",
			category: "Writing",
			tags: [],
			author: "Test Author",
		});
		expect(result.success).toBe(true);
	});

	it("uses default empty array when tags not provided", () => {
		const result = promptSchema.safeParse({
			title: "Test Prompt",
			content: "This is test content",
			category: "Writing",
			author: "Test Author",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.tags).toEqual([]);
		}
	});

	it("rejects empty title", () => {
		const result = promptSchema.safeParse({
			title: "",
			content: "This is test content",
			category: "Writing",
			author: "Test Author",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe("Title is required");
		}
	});

	it("rejects title exceeding max length", () => {
		const result = promptSchema.safeParse({
			title: "a".repeat(201),
			content: "This is test content",
			category: "Writing",
			author: "Test Author",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe("Title too long");
		}
	});

	it("rejects empty content", () => {
		const result = promptSchema.safeParse({
			title: "Test Prompt",
			content: "",
			category: "Writing",
			author: "Test Author",
		});
		expect(result.success).toBe(false);
	});

	it("rejects missing category", () => {
		const result = promptSchema.safeParse({
			title: "Test Prompt",
			content: "This is test content",
			author: "Test Author",
		});
		expect(result.success).toBe(false);
	});

	it("rejects empty author", () => {
		const result = promptSchema.safeParse({
			title: "Test Prompt",
			content: "This is test content",
			category: "Writing",
			author: "",
		});
		expect(result.success).toBe(false);
	});
});

describe("searchPromptsSchema", () => {
	it("validates empty input with defaults", () => {
		const result = searchPromptsSchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(12);
			expect(result.data.query).toBeUndefined();
			expect(result.data.category).toBeUndefined();
		}
	});

	it("validates search with query", () => {
		const result = searchPromptsSchema.safeParse({
			query: "test search",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.query).toBe("test search");
		}
	});

	it("validates search with category filter", () => {
		const result = searchPromptsSchema.safeParse({
			category: "Writing",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.category).toBe("Writing");
		}
	});

	it("validates custom pagination", () => {
		const result = searchPromptsSchema.safeParse({
			page: 2,
			limit: 20,
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(2);
			expect(result.data.limit).toBe(20);
		}
	});

	it("rejects page less than 1", () => {
		const result = searchPromptsSchema.safeParse({
			page: 0,
		});
		expect(result.success).toBe(false);
	});

	it("rejects negative page", () => {
		const result = searchPromptsSchema.safeParse({
			page: -1,
		});
		expect(result.success).toBe(false);
	});

	it("rejects limit exceeding max", () => {
		const result = searchPromptsSchema.safeParse({
			limit: 51,
		});
		expect(result.success).toBe(false);
	});

	it("validates combined search params", () => {
		const result = searchPromptsSchema.safeParse({
			query: "email",
			category: "Writing",
			page: 1,
			limit: 10,
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({
				query: "email",
				category: "Writing",
				page: 1,
				limit: 10,
			});
		}
	});
});
