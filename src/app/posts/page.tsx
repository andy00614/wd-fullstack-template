import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { CreatePostForm, DeletePostButton } from "@/modules/posts";

export default async function PostsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/");
	}

	const start = performance.now();
	const userPosts = await db.query.posts.findMany({
		where: eq(posts.userId, user.id),
		orderBy: (posts, { desc }) => [desc(posts.createdAt)],
	});
	const queryDuration = (performance.now() - start).toFixed(2);

	return (
		<main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container mx-auto px-4 py-16">
				<div className="mb-8 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<h1 className="font-bold text-3xl">My Posts</h1>
						<span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-300 text-sm">
							Query: {queryDuration}ms
						</span>
					</div>
					<Link
						className="rounded-full bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20"
						href="/"
					>
						Back
					</Link>
				</div>

				<CreatePostForm />

				<div className="space-y-4">
					{userPosts.length === 0 ? (
						<p className="text-center text-white/60">
							No posts yet. Create your first post above!
						</p>
					) : (
						userPosts.map((post) => (
							<div className="rounded-xl bg-white/10 p-6" key={post.id}>
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<h3 className="font-semibold text-xl">{post.title}</h3>
										{post.content && (
											<p className="mt-2 text-white/80">{post.content}</p>
										)}
										<p className="mt-2 text-sm text-white/50">
											{post.createdAt.toLocaleDateString()}
										</p>
									</div>
									<div className="flex gap-2">
										<Link
											className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
											href={`/posts/${post.id}/edit`}
										>
											Edit
										</Link>
										<DeletePostButton postId={post.id} />
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</main>
	);
}
