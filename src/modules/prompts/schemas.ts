import { z } from "zod";

export const promptSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	content: z.string().min(1, "Content is required"),
	category: z.string().min(1, "Category is required"),
	tags: z.array(z.string()),
});

export const updatePromptSchema = promptSchema.extend({
	id: z.string().uuid("Invalid prompt ID"),
});

export const deletePromptSchema = z.object({
	id: z.string().uuid("Invalid prompt ID"),
});

export const toggleFavoriteSchema = z.object({
	promptId: z.string().uuid("Invalid prompt ID"),
});

export const searchPromptsSchema = z.object({
	query: z.string().optional(),
	category: z.string().optional(),
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().max(50).optional().default(12),
});

export type PromptFormData = z.infer<typeof promptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type DeletePromptInput = z.infer<typeof deletePromptSchema>;
export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
export type SearchPromptsInput = z.input<typeof searchPromptsSchema>;
