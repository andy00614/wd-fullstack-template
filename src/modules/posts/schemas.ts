import { z } from "zod";

export const postSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
