"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePost } from "../../actions";

export function EditPostForm({
	post,
}: {
	post: { id: string; title: string; content: string | null };
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [duration, setDuration] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		setDuration(null);
		startTransition(async () => {
			const result = await updatePost(formData);
			setDuration(result.duration);
			setTimeout(() => router.push("/posts"), 500);
		});
	}

	return (
		<form action={handleSubmit} className="rounded-xl bg-white/10 p-6">
			<input name="id" type="hidden" value={post.id} />
			{duration && (
				<div className="mb-4 rounded-lg bg-green-500/20 px-4 py-2 text-green-300">
					Updated in {duration}ms
				</div>
			)}
			<div className="flex flex-col gap-4">
				<input
					className="rounded-lg bg-white/10 px-4 py-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
					defaultValue={post.title}
					disabled={isPending}
					name="title"
					placeholder="Title"
					required
					type="text"
				/>
				<textarea
					className="rounded-lg bg-white/10 px-4 py-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
					defaultValue={post.content ?? ""}
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
					{isPending ? "Updating..." : "Update Post"}
				</button>
			</div>
		</form>
	);
}
