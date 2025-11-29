"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPost, deletePost } from "../actions";
import { type PostFormData, postSchema } from "../schemas";

export function CreatePostForm() {
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PostFormData>({
		resolver: zodResolver(postSchema),
	});

	function onSubmit(data: PostFormData) {
		const formData = new FormData();
		formData.set("title", data.title);
		formData.set("content", data.content ?? "");

		startTransition(async () => {
			const result = await createPost(formData);
			toast.success(`Post created in ${result.duration}ms`);
			reset();
		});
	}

	return (
		<Card className="mb-8 border-white/10 bg-white/10">
			<CardHeader>
				<CardTitle className="text-white text-xl">Create New Post</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-2">
						<Label className="text-white" htmlFor="title">
							Title
						</Label>
						<Input
							{...register("title")}
							className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
							disabled={isPending}
							id="title"
							placeholder="Enter post title"
						/>
						{errors.title && (
							<p className="text-red-400 text-sm">{errors.title.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label className="text-white" htmlFor="content">
							Content
						</Label>
						<Textarea
							{...register("content")}
							className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
							disabled={isPending}
							id="content"
							placeholder="Enter post content (optional)"
							rows={3}
						/>
					</div>
					<Button
						className="self-start bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,60%)]"
						disabled={isPending}
						type="submit"
					>
						{isPending ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Plus className="mr-2 h-4 w-4" />
						)}
						{isPending ? "Creating..." : "Create Post"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

export function DeletePostButton({ postId }: { postId: string }) {
	const [isPending, startTransition] = useTransition();

	function handleDelete() {
		startTransition(async () => {
			const formData = new FormData();
			formData.set("id", postId);
			const result = await deletePost(formData);
			toast.success(`Post deleted in ${result.duration}ms`);
		});
	}

	return (
		<Button
			disabled={isPending}
			onClick={handleDelete}
			size="sm"
			type="button"
			variant="destructive"
		>
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Trash2 className="h-4 w-4" />
			)}
		</Button>
	);
}
