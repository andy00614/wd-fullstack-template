import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getMyPrompts, getUserFavorites, PromptList } from "@/modules/prompts";

export default async function MyPromptsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login?redirect=/prompts/my");
	}

	const [prompts, favoriteIds] = await Promise.all([
		getMyPrompts(),
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
						<Button asChild size="sm">
							<Link href="/prompts/new">
								<Plus className="mr-2 h-4 w-4" />
								New Prompt
							</Link>
						</Button>
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
			</div>

			{/* Main content */}
			<div className="mx-auto max-w-7xl px-6 py-12">
				{/* Page header */}
				<div className="mb-12">
					<h1 className="mb-4 font-bold text-4xl text-[#1a1a1a] tracking-tight">
						My Prompts
					</h1>
					<p className="text-gray-500 text-lg">
						Manage your created prompts. You have {prompts.length} prompt
						{prompts.length !== 1 ? "s" : ""}.
					</p>
				</div>

				{/* Prompt grid */}
				<PromptList
					currentUserId={user.id}
					emptyMessage="You haven't created any prompts yet. Click 'New Prompt' to get started!"
					favoriteIds={favoriteIds}
					isLoggedIn={true}
					prompts={prompts}
				/>
			</div>
		</main>
	);
}
