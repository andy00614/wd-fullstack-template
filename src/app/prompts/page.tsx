import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
	getFavoritePrompts,
	getPrompts,
	getUserPrompts,
	PromptList,
	PromptListSkeleton,
	PromptSearch,
} from "@/modules/prompts";

interface PromptsPageProps {
	searchParams: Promise<{
		q?: string;
		category?: string;
		favorites?: string;
		mine?: string;
	}>;
}

// Separate async component for prompt data fetching
async function PromptResults({
	query,
	category,
	showFavorites,
	showMine,
	userId,
}: {
	query: string;
	category: string;
	showFavorites: boolean;
	showMine: boolean;
	userId?: string;
}) {
	// Get prompts based on filter
	let prompts: Awaited<ReturnType<typeof getPrompts>>;
	if (showFavorites && userId) {
		prompts = await getFavoritePrompts();
		// Apply additional filters to favorites
		if (query) {
			const q = query.toLowerCase();
			prompts = prompts.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.content.toLowerCase().includes(q),
			);
		}
		if (category) {
			prompts = prompts.filter((p) => p.category === category);
		}
	} else if (showMine && userId) {
		prompts = await getUserPrompts();
		// Apply additional filters to user's prompts
		if (query) {
			const q = query.toLowerCase();
			prompts = prompts.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.content.toLowerCase().includes(q),
			);
		}
		if (category) {
			prompts = prompts.filter((p) => p.category === category);
		}
	} else {
		prompts = await getPrompts({
			query: query || undefined,
			category: category || undefined,
		});
	}

	return (
		<>
			{/* Results info */}
			<div className="mb-6 flex items-center justify-between">
				<p className="text-gray-500">
					{prompts.length} prompt
					{prompts.length !== 1 ? "s" : ""} found
					{query && (
						<span>
							{" "}
							for "<span className="font-medium text-[#1a1a1a]">{query}</span>"
						</span>
					)}
					{showFavorites && (
						<span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-red-600 text-xs">
							Favorites
						</span>
					)}
					{showMine && (
						<span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-purple-600 text-xs">
							My Prompts
						</span>
					)}
				</p>
			</div>

			{/* Prompt grid */}
			<PromptList isLoggedIn={!!userId} prompts={prompts} />
		</>
	);
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
	const params = await searchParams;
	const query = params.q || "";
	const category = params.category || "";
	const showFavorites = params.favorites === "true";
	const showMine = params.mine === "true";

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Create a unique key for Suspense to trigger re-render on filter change
	const suspenseKey = `${query}-${category}-${showFavorites}-${showMine}`;

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
					<div className="flex items-center gap-4">
						{user && (
							<Button
								asChild
								className="bg-[#6D28D9] text-white hover:bg-[#5B21B6]"
							>
								<Link href="/prompts/new">
									<Plus className="mr-2 h-4 w-4" />
									New Prompt
								</Link>
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
					<PromptSearch isLoggedIn={!!user} />
				</div>

				{/* Prompt results with Suspense */}
				<Suspense
					fallback={
						<>
							<div className="mb-6">
								<div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
							</div>
							<PromptListSkeleton count={6} />
						</>
					}
					key={suspenseKey}
				>
					<PromptResults
						category={category}
						query={query}
						showFavorites={showFavorites}
						showMine={showMine}
						userId={user?.id}
					/>
				</Suspense>
			</div>
		</main>
	);
}
