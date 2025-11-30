"use server";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { promptFavorites, prompts } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import {
	deletePromptSchema,
	promptSchema,
	type SearchPromptsInput,
	searchPromptsSchema,
	toggleFavoriteSchema,
	updatePromptSchema,
} from "../schemas";
import type { PromptWithFavorite } from "../types";

export async function getPrompts(
	input?: SearchPromptsInput,
): Promise<PromptWithFavorite[]> {
	const validated = searchPromptsSchema.parse(input ?? {});
	const { query, category, page, limit } = validated;

	const offset = (page - 1) * limit;

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

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

	// Get user's favorites if logged in
	let userFavorites: Set<string> = new Set();
	if (user) {
		const favorites = await db
			.select({ promptId: promptFavorites.promptId })
			.from(promptFavorites)
			.where(eq(promptFavorites.userId, user.id));
		userFavorites = new Set(favorites.map((f) => f.promptId));
	}

	return results.map((prompt) => ({
		...prompt,
		isFavorited: userFavorites.has(prompt.id),
		isOwner: user?.id === prompt.userId,
	}));
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

export async function createPrompt(formData: FormData) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const start = performance.now();

	const tagsRaw = formData.get("tags") as string;
	const tags = tagsRaw
		? tagsRaw
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: [];

	const validated = promptSchema.parse({
		title: formData.get("title"),
		content: formData.get("content"),
		category: formData.get("category"),
		tags,
	});

	await db.insert(prompts).values({
		...validated,
		author: user.email ?? "Anonymous",
		userId: user.id,
	});

	revalidatePath("/prompts");

	return { duration: (performance.now() - start).toFixed(2) };
}

export async function updatePrompt(formData: FormData) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const start = performance.now();

	const tagsRaw = formData.get("tags") as string;
	const tags = tagsRaw
		? tagsRaw
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: [];

	const validated = updatePromptSchema.parse({
		id: formData.get("id"),
		title: formData.get("title"),
		content: formData.get("content"),
		category: formData.get("category"),
		tags,
	});

	// Check ownership
	const existing = await db
		.select({ userId: prompts.userId })
		.from(prompts)
		.where(eq(prompts.id, validated.id))
		.limit(1);

	if (!existing[0] || existing[0].userId !== user.id) {
		throw new Error("Unauthorized");
	}

	await db
		.update(prompts)
		.set({
			title: validated.title,
			content: validated.content,
			category: validated.category,
			tags: validated.tags,
			updatedAt: new Date(),
		})
		.where(eq(prompts.id, validated.id));

	revalidatePath("/prompts");

	return { duration: (performance.now() - start).toFixed(2) };
}

export async function deletePrompt(formData: FormData) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const start = performance.now();

	const validated = deletePromptSchema.parse({
		id: formData.get("id"),
	});

	// Check ownership
	const existing = await db
		.select({ userId: prompts.userId })
		.from(prompts)
		.where(eq(prompts.id, validated.id))
		.limit(1);

	if (!existing[0] || existing[0].userId !== user.id) {
		throw new Error("Unauthorized");
	}

	await db.delete(prompts).where(eq(prompts.id, validated.id));

	revalidatePath("/prompts");

	return { duration: (performance.now() - start).toFixed(2) };
}

export async function toggleFavorite(formData: FormData) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const validated = toggleFavoriteSchema.parse({
		promptId: formData.get("promptId"),
	});

	// Check if already favorited
	const existing = await db
		.select()
		.from(promptFavorites)
		.where(
			and(
				eq(promptFavorites.promptId, validated.promptId),
				eq(promptFavorites.userId, user.id),
			),
		)
		.limit(1);

	if (existing[0]) {
		// Remove favorite
		await db
			.delete(promptFavorites)
			.where(
				and(
					eq(promptFavorites.promptId, validated.promptId),
					eq(promptFavorites.userId, user.id),
				),
			);

		// Decrement count
		await db
			.update(prompts)
			.set({
				favoritesCount: sql`${prompts.favoritesCount} - 1`,
			})
			.where(eq(prompts.id, validated.promptId));

		revalidatePath("/prompts");
		return { favorited: false };
	}

	// Add favorite
	await db.insert(promptFavorites).values({
		promptId: validated.promptId,
		userId: user.id,
	});

	// Increment count
	await db
		.update(prompts)
		.set({
			favoritesCount: sql`${prompts.favoritesCount} + 1`,
		})
		.where(eq(prompts.id, validated.promptId));

	revalidatePath("/prompts");
	return { favorited: true };
}

export async function getUserPrompts(): Promise<PromptWithFavorite[]> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return [];
	}

	const results = await db
		.select()
		.from(prompts)
		.where(eq(prompts.userId, user.id))
		.orderBy(desc(prompts.createdAt));

	// Get user's favorites
	const favorites = await db
		.select({ promptId: promptFavorites.promptId })
		.from(promptFavorites)
		.where(eq(promptFavorites.userId, user.id));
	const userFavorites = new Set(favorites.map((f) => f.promptId));

	return results.map((prompt) => ({
		...prompt,
		isFavorited: userFavorites.has(prompt.id),
		isOwner: true,
	}));
}

export async function getFavoritePrompts(): Promise<PromptWithFavorite[]> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return [];
	}

	const results = await db
		.select({
			id: prompts.id,
			title: prompts.title,
			content: prompts.content,
			category: prompts.category,
			tags: prompts.tags,
			author: prompts.author,
			userId: prompts.userId,
			favoritesCount: prompts.favoritesCount,
			createdAt: prompts.createdAt,
			updatedAt: prompts.updatedAt,
		})
		.from(promptFavorites)
		.innerJoin(prompts, eq(promptFavorites.promptId, prompts.id))
		.where(eq(promptFavorites.userId, user.id))
		.orderBy(desc(promptFavorites.createdAt));

	return results.map((prompt) => ({
		...prompt,
		isFavorited: true,
		isOwner: prompt.userId === user.id,
	}));
}
