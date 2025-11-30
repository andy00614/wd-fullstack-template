"use server";

import { desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { prompts } from "@/db/schema";
import { type SearchPromptsInput, searchPromptsSchema } from "../schemas";

export async function getPrompts(input?: SearchPromptsInput) {
	const validated = searchPromptsSchema.parse(input ?? {});
	const { query, category, page, limit } = validated;

	const offset = (page - 1) * limit;

	let queryBuilder = db.select().from(prompts).$dynamic();

	// Apply search filter
	if (query) {
		const searchPattern = `%${query}%`;
		queryBuilder = queryBuilder.where(
			or(
				ilike(prompts.title, searchPattern),
				ilike(prompts.content, searchPattern),
			),
		);
	}

	// Apply category filter
	if (category) {
		queryBuilder = queryBuilder.where(eq(prompts.category, category));
	}

	// Apply ordering and pagination
	const results = await queryBuilder
		.orderBy(desc(prompts.favoritesCount))
		.limit(limit)
		.offset(offset);

	return results;
}

export async function getPromptById(id: string) {
	const result = await db
		.select()
		.from(prompts)
		.where(eq(prompts.id, id))
		.limit(1);

	return result[0] ?? null;
}

export async function getCategories() {
	const results = await db
		.selectDistinct({ category: prompts.category })
		.from(prompts)
		.orderBy(prompts.category);

	return results.map((r) => r.category);
}
