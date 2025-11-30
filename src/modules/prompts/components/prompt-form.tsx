"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPrompt, updatePrompt } from "../actions";
import {
	type CreatePromptInput,
	type UpdatePromptInput,
	createPromptSchema,
} from "../schemas";
import type { Prompt } from "../types";

const CATEGORIES = [
	"Writing",
	"Coding",
	"Marketing",
	"Business",
	"Creative",
	"Education",
];

interface PromptFormProps {
	prompt?: Prompt;
	mode: "create" | "edit";
}

export function PromptForm({ prompt, mode }: PromptFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [tagsInput, setTagsInput] = useState(prompt?.tags.join(", ") || "");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreatePromptInput>({
		resolver: zodResolver(createPromptSchema),
		defaultValues: {
			title: prompt?.title || "",
			content: prompt?.content || "",
			category: prompt?.category || "",
			tags: prompt?.tags || [],
		},
	});

	async function onSubmit(data: CreatePromptInput) {
		const tags = tagsInput
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);

		startTransition(async () => {
			try {
				if (mode === "edit" && prompt) {
					const updateData: UpdatePromptInput = {
						id: prompt.id,
						...data,
						tags,
					};
					await updatePrompt(updateData);
					toast.success("Prompt updated successfully");
				} else {
					await createPrompt({ ...data, tags });
					toast.success("Prompt created successfully");
				}
				router.push("/prompts");
				router.refresh();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Something went wrong",
				);
			}
		});
	}

	return (
		<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					placeholder="Enter a descriptive title"
					{...register("title")}
				/>
				{errors.title && (
					<p className="text-red-500 text-sm">{errors.title.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="content">Content</Label>
				<Textarea
					className="min-h-[200px]"
					id="content"
					placeholder="Write your prompt content here..."
					{...register("content")}
				/>
				{errors.content && (
					<p className="text-red-500 text-sm">{errors.content.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="category">Category</Label>
				<select
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					id="category"
					{...register("category")}
				>
					<option value="">Select a category</option>
					{CATEGORIES.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
				{errors.category && (
					<p className="text-red-500 text-sm">{errors.category.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="tags">Tags (comma separated)</Label>
				<Input
					id="tags"
					onChange={(e) => setTagsInput(e.target.value)}
					placeholder="e.g., productivity, writing, email"
					value={tagsInput}
				/>
				<p className="text-gray-500 text-xs">
					Separate multiple tags with commas
				</p>
			</div>

			<div className="flex gap-4">
				<Button
					className="flex-1"
					disabled={isPending}
					type="submit"
				>
					{isPending
						? mode === "edit"
							? "Updating..."
							: "Creating..."
						: mode === "edit"
							? "Update Prompt"
							: "Create Prompt"}
				</Button>
				<Button
					onClick={() => router.back()}
					type="button"
					variant="outline"
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
