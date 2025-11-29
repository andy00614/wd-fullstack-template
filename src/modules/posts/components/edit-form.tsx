"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePost } from "../actions";

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
		<Card className="border-white/10 bg-white/10">
			<CardContent className="pt-6">
				<form action={handleSubmit} className="flex flex-col gap-4">
					<input name="id" type="hidden" value={post.id} />
					{duration && (
						<Badge className="w-fit bg-green-500/20 text-green-300">
							Updated in {duration}ms
						</Badge>
					)}
					<div className="space-y-2">
						<Label className="text-white" htmlFor="title">
							Title
						</Label>
						<Input
							className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
							defaultValue={post.title}
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
							defaultValue={post.content ?? ""}
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
						{isPending ? "Updating..." : "Update Post"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
