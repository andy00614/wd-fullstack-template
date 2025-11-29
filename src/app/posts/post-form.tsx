"use client";

import { useState, useTransition } from "react";
import { createPost, deletePost } from "./actions";

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
		<form action={handleSubmit} className="mb-8 rounded-xl bg-white/10 p-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-xl">Create New Post</h2>
				{timing && (
					<div className="flex gap-2 text-sm">
						<span className="rounded-full bg-green-500/20 px-3 py-1 text-green-300">
							Total: {timing.duration}ms
						</span>
						<span className="rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-300">
							Auth: {timing.authDuration}ms
						</span>
						<span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-300">
							DB: {timing.dbDuration}ms
						</span>
					</div>
				)}
			</div>
			<div className="flex flex-col gap-4">
				<input
					className="rounded-lg bg-white/10 px-4 py-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
					disabled={isPending}
					name="title"
					placeholder="Title"
					required
					type="text"
				/>
				<textarea
					className="rounded-lg bg-white/10 px-4 py-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
					disabled={isPending}
					name="content"
					placeholder="Content (optional)"
					rows={3}
				/>
				<button
					className="self-start rounded-full bg-[hsl(280,100%,70%)] px-6 py-2 font-semibold transition hover:bg-[hsl(280,100%,60%)] disabled:opacity-50"
					disabled={isPending}
					type="submit"
				>
					{isPending ? "Creating..." : "Create Post"}
				</button>
			</div>
		</form>
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
			{duration && <span className="text-green-300 text-xs">{duration}ms</span>}
			<button
				className="rounded-lg bg-red-500/20 px-4 py-2 text-red-300 text-sm transition hover:bg-red-500/30 disabled:opacity-50"
				disabled={isPending}
				onClick={handleDelete}
				type="button"
			>
				{isPending ? "..." : "Delete"}
			</button>
		</div>
	);
}
