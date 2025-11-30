"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createPrompt, updatePrompt } from "../actions";
import { type PromptFormData, promptSchema } from "../schemas";
import type { Prompt } from "../types";

const CATEGORIES = [
	"Writing",
	"Coding",
	"Marketing",
	"Business",
	"Creative",
	"Education",
	"General",
];

interface PromptFormProps {
	prompt?: Prompt;
	mode: "create" | "edit";
}

export function PromptForm({ prompt, mode }: PromptFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<PromptFormData>({
		resolver: zodResolver(promptSchema),
		defaultValues: {
			title: prompt?.title ?? "",
			content: prompt?.content ?? "",
			category: prompt?.category ?? "",
			tags: prompt?.tags ?? [],
		},
	});

	const category = watch("category");

	function onSubmit(data: PromptFormData) {
		const formData = new FormData();
		if (prompt?.id) {
			formData.set("id", prompt.id);
		}
		formData.set("title", data.title);
		formData.set("content", data.content);
		formData.set("category", data.category);
		formData.set("tags", data.tags.join(","));

		startTransition(async () => {
			if (mode === "create") {
				const result = await createPrompt(formData);
				toast.success(`Prompt created in ${result.duration}ms`);
				reset();
				router.push("/prompts");
			} else {
				const result = await updatePrompt(formData);
				toast.success(`Prompt updated in ${result.duration}ms`);
				router.push("/prompts");
			}
		});
	}

	return (
		<Card className="border-gray-200 bg-white shadow-sm">
			<CardHeader>
				<CardTitle className="text-[#1a1a1a] text-xl">
					{mode === "create" ? "Create New Prompt" : "Edit Prompt"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-2">
						<Label className="text-[#1a1a1a]" htmlFor="title">
							Title
						</Label>
						<Input
							{...register("title")}
							className="border-gray-200 bg-white text-[#1a1a1a] placeholder:text-gray-400"
							disabled={isPending}
							id="title"
							placeholder="Enter prompt title"
						/>
						{errors.title && (
							<p className="text-red-500 text-sm">{errors.title.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label className="text-[#1a1a1a]" htmlFor="category">
							Category
						</Label>
						<Select
							disabled={isPending}
							onValueChange={(value) => setValue("category", value)}
							value={category}
						>
							<SelectTrigger className="border-gray-200 bg-white text-[#1a1a1a]">
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map((cat) => (
									<SelectItem key={cat} value={cat}>
										{cat}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.category && (
							<p className="text-red-500 text-sm">{errors.category.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label className="text-[#1a1a1a]" htmlFor="content">
							Content
						</Label>
						<Textarea
							{...register("content")}
							className="min-h-[200px] border-gray-200 bg-white text-[#1a1a1a] placeholder:text-gray-400"
							disabled={isPending}
							id="content"
							placeholder="Enter your prompt content..."
						/>
						{errors.content && (
							<p className="text-red-500 text-sm">{errors.content.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label className="text-[#1a1a1a]" htmlFor="tags">
							Tags (comma-separated)
						</Label>
						<Input
							className="border-gray-200 bg-white text-[#1a1a1a] placeholder:text-gray-400"
							defaultValue={prompt?.tags.join(", ") ?? ""}
							disabled={isPending}
							id="tags"
							onChange={(e) => {
								const tags = e.target.value
									.split(",")
									.map((t) => t.trim())
									.filter(Boolean);
								setValue("tags", tags);
							}}
							placeholder="e.g., productivity, writing, ai"
						/>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							className="bg-[#6D28D9] text-white hover:bg-[#5B21B6]"
							disabled={isPending}
							type="submit"
						>
							{isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : mode === "create" ? (
								<Plus className="mr-2 h-4 w-4" />
							) : (
								<Save className="mr-2 h-4 w-4" />
							)}
							{isPending
								? mode === "create"
									? "Creating..."
									: "Updating..."
								: mode === "create"
									? "Create Prompt"
									: "Update Prompt"}
						</Button>
						<Button
							disabled={isPending}
							onClick={() => router.back()}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
