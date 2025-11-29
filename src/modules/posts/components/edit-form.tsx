"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePost } from "../actions";
import { type PostFormData, postSchema } from "../schemas";

export function EditPostForm({
	post,
}: {
	post: { id: string; title: string; content: string | null };
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PostFormData>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: post.title,
			content: post.content ?? "",
		},
	});

	function onSubmit(data: PostFormData) {
		startTransition(async () => {
			const formData = new FormData();
			formData.set("id", post.id);
			formData.set("title", data.title);
			formData.set("content", data.content ?? "");
			const result = await updatePost(formData);
			toast.success(`Post updated in ${result.duration}ms`);
			setTimeout(() => router.push("/posts"), 500);
		});
	}

	return (
		<Card className="border-white/10 bg-white/10">
			<CardContent className="pt-6">
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
							<Save className="mr-2 h-4 w-4" />
						)}
						{isPending ? "Updating..." : "Update Post"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
