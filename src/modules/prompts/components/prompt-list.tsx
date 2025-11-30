import type { Prompt } from "../types";
import { PromptCard } from "./prompt-card";

interface PromptListProps {
	prompts: Prompt[];
	currentUserId?: string;
	favoriteIds?: string[];
	isLoggedIn?: boolean;
	emptyMessage?: string;
}

export function PromptList({
	prompts,
	currentUserId,
	favoriteIds = [],
	isLoggedIn = false,
	emptyMessage = "Try adjusting your search or filters to find what you're looking for.",
}: PromptListProps) {
	if (prompts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8FF]">
					<span className="text-2xl">🔍</span>
				</div>
				<h3 className="mb-2 font-bold text-[#1a1a1a] text-lg">
					No prompts found
				</h3>
				<p className="text-gray-500">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{prompts.map((prompt) => (
				<PromptCard
					currentUserId={currentUserId}
					isFavorited={favoriteIds.includes(prompt.id)}
					isLoggedIn={isLoggedIn}
					key={prompt.id}
					prompt={prompt}
				/>
			))}
		</div>
	);
}
