import { ArrowLeft, Heart, Plus, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
	getPrompts,
	getUserFavorites,
	PromptList,
	PromptSearch,
} from "@/modules/prompts";

interface PromptsPageProps {
	searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
	const params = await searchParams;
	const query = params.q || "";
	const category = params.category || "";

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const [prompts, favoriteIds] = await Promise.all([
		getPrompts({
			query: query || undefined,
			category: category || undefined,
		}),
		getUserFavorites(),
	]);

	return (
		<main className="min-h-screen bg-white">
			{/* Header */}
			<div className="border-gray-100 border-b">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
					<Link
						className="flex cursor-pointer select-none items-center gap-2 font-bold text-xl tracking-tight"
						href="/"
					>
						<span className="font-black text-2xl">WD</span>
						<span className="font-medium text-gray-400">Template</span>
					</Link>
					<div className="flex items-center gap-2">
						{user ? (
							<>
								<Button
									asChild
									className="text-gray-500 hover:text-[#1a1a1a]"
									size="sm"
									variant="ghost"
								>
									<Link href="/prompts/my">
										<User className="mr-2 h-4 w-4" />
										My Prompts
									</Link>
								</Button>
								<Button
									asChild
									className="text-gray-500 hover:text-[#1a1a1a]"
									size="sm"
									variant="ghost"
								>
									<Link href="/prompts/favorites">
										<Heart className="mr-2 h-4 w-4" />
										Favorites
									</Link>
								</Button>
								<Button asChild size="sm">
									<Link href="/prompts/new">
										<Plus className="mr-2 h-4 w-4" />
										New Prompt
									</Link>
								</Button>
							</>
						) : (
							<Button asChild size="sm" variant="outline">
								<Link href="/login">Log in to create</Link>
							</Button>
						)}
						<Button
							asChild
							className="text-gray-500 hover:text-[#1a1a1a]"
							variant="ghost"
						>
							<Link href="/">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to home
							</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="mx-auto max-w-7xl px-6 py-12">
				{/* Page header */}
				<div className="mb-12 text-center">
					<h1 className="mb-4 font-bold text-4xl text-[#1a1a1a] tracking-tight md:text-5xl">
						Prompt Library
					</h1>
					<p className="mx-auto max-w-2xl text-gray-500 text-lg">
						Discover and use curated prompts to boost your productivity. Search
						by keyword or filter by category.
					</p>
				</div>

				{/* Search section */}
				<div className="mb-12">
					<Suspense
						fallback={
							<div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
						}
					>
						<PromptSearch />
					</Suspense>
				</div>

				{/* Results info */}
				<div className="mb-6 flex items-center justify-between">
					<p className="text-gray-500">
						{prompts.length} prompt
						{prompts.length !== 1 ? "s" : ""} found
						{query && (
							<span>
								{" "}
								for "<span className="font-medium text-[#1a1a1a]">{query}</span>
								"
							</span>
						)}
					</p>
				</div>

				{/* Prompt grid */}
				<PromptList
					currentUserId={user?.id}
					favoriteIds={favoriteIds}
					isLoggedIn={!!user}
					prompts={prompts}
				/>
			</div>
		</main>
	);
}
