import { z } from "zod";

// Schema for creating a new prompt
export const createPromptSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	content: z.string().min(1, "Content is required"),
	category: z.string().min(1, "Category is required"),
	tags: z.array(z.string()).default([]),
});

// Schema for updating a prompt
export const updatePromptSchema = z.object({
	id: z.string().uuid("Invalid prompt ID"),
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	content: z.string().min(1, "Content is required"),
	category: z.string().min(1, "Category is required"),
	tags: z.array(z.string()).default([]),
});

// Schema for deleting a prompt
export const deletePromptSchema = z.object({
	id: z.string().uuid("Invalid prompt ID"),
});

// Schema for favorite/unfavorite operations
export const favoritePromptSchema = z.object({
	promptId: z.string().uuid("Invalid prompt ID"),
});

// Schema for search and filtering
export const searchPromptsSchema = z.object({
	query: z.string().optional(),
	category: z.string().optional(),
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().max(50).optional().default(12),
});

// Legacy schema for backwards compatibility
export const promptSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	content: z.string().min(1, "Content is required"),
	category: z.string().min(1, "Category is required"),
	tags: z.array(z.string()).default([]),
	author: z.string().min(1, "Author is required"),
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type DeletePromptInput = z.infer<typeof deletePromptSchema>;
export type FavoritePromptInput = z.infer<typeof favoritePromptSchema>;
export type PromptFormData = z.infer<typeof promptSchema>;
export type SearchPromptsInput = z.input<typeof searchPromptsSchema>;
