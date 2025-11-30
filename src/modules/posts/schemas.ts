import { z } from "zod";

export const postSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().optional(),
});

export const deletePostSchema = z.object({
	id: z.string().uuid("Invalid post ID"),
});

export type PostFormData = z.infer<typeof postSchema>;
export type DeletePostInput = z.infer<typeof deletePostSchema>;
