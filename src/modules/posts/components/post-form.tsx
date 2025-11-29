"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPost, deletePost } from "../actions";

type TimingResult = {
	duration: string;
	authDuration: string;
	dbDuration: string;
};

export function CreatePostForm() {
	const [isPending, startTransition] = useTransition();
	const [timing, setTiming] = useState<TimingResult | null>(null);

	async function handleSubmit(formData: FormData) {
		setTiming(null);
		startTransition(async () => {
			const result = await createPost(formData);
			setTiming(result);
		});
	}

	return (
		<Card className="mb-8 border-white/10 bg-white/10">
			<CardHeader className="flex-row items-center justify-between">
				<CardTitle className="text-white text-xl">Create New Post</CardTitle>
				{timing && (
					<div className="flex gap-2">
						<Badge className="bg-green-500/20 text-green-300">
							Total: {timing.duration}ms
						</Badge>
						<Badge className="bg-yellow-500/20 text-yellow-300">
							Auth: {timing.authDuration}ms
						</Badge>
						<Badge className="bg-blue-500/20 text-blue-300">
							DB: {timing.dbDuration}ms
						</Badge>
					</div>
				)}
			</CardHeader>
			<CardContent>
				<form action={handleSubmit} className="flex flex-col gap-4">
					<div className="space-y-2">
						<Label className="text-white" htmlFor="title">
							Title
						</Label>
						<Input
							className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
							disabled={isPending}
							id="title"
							name="title"
							placeholder="Enter post title"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label className="text-white" htmlFor="content">
							Content
						</Label>
						<Textarea
							className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
							disabled={isPending}
							id="content"
							name="content"
							placeholder="Enter post content (optional)"
							rows={3}
						/>
					</div>
					<Button
						className="self-start bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,60%)]"
						disabled={isPending}
						type="submit"
					>
						{isPending ? "Creating..." : "Create Post"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

export function DeletePostButton({ postId }: { postId: string }) {
	const [isPending, startTransition] = useTransition();
	const [duration, setDuration] = useState<string | null>(null);

	async function handleDelete() {
		const formData = new FormData();
		formData.set("id", postId);
		startTransition(async () => {
			const result = await deletePost(formData);
			setDuration(result.duration);
		});
	}

	return (
		<div className="flex items-center gap-2">
			{duration && (
				<Badge className="bg-green-500/20 text-green-300">{duration}ms</Badge>
			)}
			<Button
				disabled={isPending}
				onClick={handleDelete}
				size="sm"
				type="button"
				variant="destructive"
			>
				{isPending ? "..." : "Delete"}
			</Button>
		</div>
	);
}
