import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { EditPostForm } from "@/modules/posts";

export default async function EditPostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/");
	}

	const start = performance.now();
	const post = await db.query.posts.findFirst({
		where: eq(posts.id, id),
	});
	const queryDuration = (performance.now() - start).toFixed(2);

	if (!post || post.userId !== user.id) {
		redirect("/posts");
	}

	return (
		<main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container mx-auto px-4 py-16">
				<FadeIn>
					<div className="mb-8 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<h1 className="font-bold text-3xl">Edit Post</h1>
							<Badge className="bg-blue-500/20 text-blue-300">
								Query: {queryDuration}ms
							</Badge>
						</div>
						<Button asChild variant="ghost">
							<Link href="/posts">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>
					</div>
				</FadeIn>

				<FadeIn delay={0.1}>
					<EditPostForm post={post} />
				</FadeIn>
			</div>
		</main>
	);
}
