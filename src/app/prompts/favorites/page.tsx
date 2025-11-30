import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
	getFavoritePrompts,
	getUserFavorites,
	PromptList,
} from "@/modules/prompts";

export default async function FavoritesPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login?redirect=/prompts/favorites");
	}

	const [prompts, favoriteIds] = await Promise.all([
		getFavoritePrompts(),
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
					<Button
						asChild
						className="text-gray-500 hover:text-[#1a1a1a]"
						variant="ghost"
					>
						<Link href="/prompts">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to library
						</Link>
					</Button>
				</div>
			</div>

			{/* Main content */}
			<div className="mx-auto max-w-7xl px-6 py-12">
				{/* Page header */}
				<div className="mb-12">
					<div className="mb-4 flex items-center gap-3">
						<Heart className="h-10 w-10 text-red-500" />
						<h1 className="font-bold text-4xl text-[#1a1a1a] tracking-tight">
							Favorites
						</h1>
					</div>
					<p className="text-gray-500 text-lg">
						Your favorite prompts. You have {prompts.length} saved prompt
						{prompts.length !== 1 ? "s" : ""}.
					</p>
				</div>

				{/* Prompt grid */}
				<PromptList
					currentUserId={user.id}
					emptyMessage="You haven't favorited any prompts yet. Browse the library and click the heart icon to save prompts."
					favoriteIds={favoriteIds}
					isLoggedIn={true}
					prompts={prompts}
				/>
			</div>
		</main>
	);
}
