"use server";

import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { promptFavorites, prompts } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import {
	type CreatePromptInput,
	type DeletePromptInput,
	type FavoritePromptInput,
	type SearchPromptsInput,
	type UpdatePromptInput,
	createPromptSchema,
	deletePromptSchema,
	favoritePromptSchema,
	searchPromptsSchema,
	updatePromptSchema,
} from "../schemas";

// Helper to get current user
async function getCurrentUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

// Get prompts with optional search and filter
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

// Get single prompt by ID
export async function getPromptById(id: string) {
	const result = await db
		.select()
		.from(prompts)
		.where(eq(prompts.id, id))
		.limit(1);

	return result[0] ?? null;
}

// Get all unique categories
export async function getCategories() {
	const results = await db
		.selectDistinct({ category: prompts.category })
		.from(prompts)
		.orderBy(prompts.category);

	return results.map((r) => r.category);
}

// Create a new prompt
export async function createPrompt(input: CreatePromptInput) {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("You must be logged in to create a prompt");
	}

	const validated = createPromptSchema.parse(input);

	const result = await db
		.insert(prompts)
		.values({
			...validated,
			author: user.user_metadata?.full_name || user.email || "Anonymous",
			userId: user.id,
		})
		.returning();

	revalidatePath("/prompts");
	return result[0];
}

// Update an existing prompt
export async function updatePrompt(input: UpdatePromptInput) {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("You must be logged in to update a prompt");
	}

	const validated = updatePromptSchema.parse(input);
	const { id, ...updateData } = validated;

	// Check if user owns this prompt
	const existing = await getPromptById(id);
	if (!existing) {
		throw new Error("Prompt not found");
	}
	if (existing.userId !== user.id) {
		throw new Error("You can only edit your own prompts");
	}

	const result = await db
		.update(prompts)
		.set({
			...updateData,
			updatedAt: new Date(),
		})
		.where(eq(prompts.id, id))
		.returning();

	revalidatePath("/prompts");
	revalidatePath(`/prompts/${id}`);
	return result[0];
}

// Delete a prompt
export async function deletePrompt(input: DeletePromptInput) {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("You must be logged in to delete a prompt");
	}

	const validated = deletePromptSchema.parse(input);

	// Check if user owns this prompt
	const existing = await getPromptById(validated.id);
	if (!existing) {
		throw new Error("Prompt not found");
	}
	if (existing.userId !== user.id) {
		throw new Error("You can only delete your own prompts");
	}

	await db.delete(prompts).where(eq(prompts.id, validated.id));

	revalidatePath("/prompts");
	return { success: true };
}

// Add prompt to favorites
export async function favoritePrompt(input: FavoritePromptInput) {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("You must be logged in to favorite a prompt");
	}

	const validated = favoritePromptSchema.parse(input);

	// Check if prompt exists
	const prompt = await getPromptById(validated.promptId);
	if (!prompt) {
		throw new Error("Prompt not found");
	}

	// Check if already favorited
	const existing = await db
		.select()
		.from(promptFavorites)
		.where(
			and(
				eq(promptFavorites.userId, user.id),
				eq(promptFavorites.promptId, validated.promptId),
			),
		)
		.limit(1);

	if (existing.length > 0) {
		return { alreadyFavorited: true };
	}

	// Add to favorites and increment count
	await db.transaction(async (tx) => {
		await tx.insert(promptFavorites).values({
			userId: user.id,
			promptId: validated.promptId,
		});

		await tx
			.update(prompts)
			.set({
				favoritesCount: sql`${prompts.favoritesCount} + 1`,
			})
			.where(eq(prompts.id, validated.promptId));
	});

	revalidatePath("/prompts");
	return { success: true };
}

// Remove prompt from favorites
export async function unfavoritePrompt(input: FavoritePromptInput) {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("You must be logged in to unfavorite a prompt");
	}

	const validated = favoritePromptSchema.parse(input);

	// Check if favorited
	const existing = await db
		.select()
		.from(promptFavorites)
		.where(
			and(
				eq(promptFavorites.userId, user.id),
				eq(promptFavorites.promptId, validated.promptId),
			),
		)
		.limit(1);

	if (existing.length === 0) {
		return { notFavorited: true };
	}

	// Remove from favorites and decrement count
	await db.transaction(async (tx) => {
		await tx
			.delete(promptFavorites)
			.where(
				and(
					eq(promptFavorites.userId, user.id),
					eq(promptFavorites.promptId, validated.promptId),
				),
			);

		await tx
			.update(prompts)
			.set({
				favoritesCount: sql`GREATEST(${prompts.favoritesCount} - 1, 0)`,
			})
			.where(eq(prompts.id, validated.promptId));
	});

	revalidatePath("/prompts");
	return { success: true };
}

// Get user's favorited prompt IDs
export async function getUserFavorites(): Promise<string[]> {
	const user = await getCurrentUser();
	if (!user) {
		return [];
	}

	const results = await db
		.select({ promptId: promptFavorites.promptId })
		.from(promptFavorites)
		.where(eq(promptFavorites.userId, user.id));

	return results.map((r) => r.promptId);
}

// Get user's own prompts
export async function getMyPrompts() {
	const user = await getCurrentUser();
	if (!user) {
		return [];
	}

	const results = await db
		.select()
		.from(prompts)
		.where(eq(prompts.userId, user.id))
		.orderBy(desc(prompts.createdAt));

	return results;
}

// Get user's favorited prompts
export async function getFavoritePrompts() {
	const user = await getCurrentUser();
	if (!user) {
		return [];
	}

	const favoriteIds = await getUserFavorites();
	if (favoriteIds.length === 0) {
		return [];
	}

	const results = await db
		.select()
		.from(prompts)
		.where(inArray(prompts.id, favoriteIds))
		.orderBy(desc(prompts.favoritesCount));

	return results;
}
