import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
						<Badge className="bg-blue-500/20 text-blue-300">
							Query: {queryDuration}ms
						</Badge>
					</div>
					<Button asChild variant="ghost">
						<Link href="/">Back</Link>
					</Button>
				</div>

				<CreatePostForm />

				<div className="space-y-4">
					{userPosts.length === 0 ? (
						<p className="text-center text-white/60">
							No posts yet. Create your first post above!
						</p>
					) : (
						userPosts.map((post) => (
							<Card className="border-white/10 bg-white/10" key={post.id}>
								<CardHeader className="flex-row items-start justify-between gap-4">
									<div className="flex-1">
										<CardTitle className="text-white text-xl">
											{post.title}
										</CardTitle>
									</div>
									<div className="flex gap-2">
										<Button asChild size="sm" variant="secondary">
											<Link href={`/posts/${post.id}/edit`}>Edit</Link>
										</Button>
										<DeletePostButton postId={post.id} />
									</div>
								</CardHeader>
								{(post.content || post.createdAt) && (
									<CardContent>
										{post.content && (
											<p className="text-white/80">{post.content}</p>
										)}
										<p className="mt-2 text-sm text-white/50">
											{post.createdAt.toLocaleDateString()}
										</p>
									</CardContent>
								)}
							</Card>
						))
					)}
				</div>
			</div>
		</main>
	);
}
