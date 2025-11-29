import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
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
				<div className="mb-8 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<h1 className="font-bold text-3xl">Edit Post</h1>
						<span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-300 text-sm">
							Query: {queryDuration}ms
						</span>
					</div>
					<Link
						className="rounded-full bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20"
						href="/posts"
					>
						Back
					</Link>
				</div>

				<EditPostForm post={post} />
			</div>
		</main>
	);
}
