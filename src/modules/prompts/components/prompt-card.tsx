"use client";

import { Check, Copy, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deletePrompt } from "../actions";
import type { Prompt } from "../types";
import { FavoriteButton } from "./favorite-button";

interface PromptCardProps {
	prompt: Prompt;
	currentUserId?: string;
	isFavorited?: boolean;
	isLoggedIn?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
	Writing: { bg: "bg-[#F3E8FF]", text: "text-[#6D28D9]" },
	Coding: { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]" },
	Marketing: { bg: "bg-[#FEF3C7]", text: "text-[#B45309]" },
	Business: { bg: "bg-[#D1FAE5]", text: "text-[#047857]" },
	Creative: { bg: "bg-[#FCE7F3]", text: "text-[#BE185D]" },
	Education: { bg: "bg-[#E0E7FF]", text: "text-[#4338CA]" },
	Default: { bg: "bg-gray-100", text: "text-gray-600" },
};

export function PromptCard({
	prompt,
	currentUserId,
	isFavorited = false,
	isLoggedIn = false,
}: PromptCardProps) {
	const router = useRouter();
	const [copied, setCopied] = useState(false);
	const [isDeleting, startDeleteTransition] = useTransition();
	const colors = categoryColors[prompt.category] ??
		categoryColors.Default ?? { bg: "bg-gray-100", text: "text-gray-600" };

	const isOwner = currentUserId && prompt.userId === currentUserId;

	async function handleCopy() {
		await navigator.clipboard.writeText(prompt.content);
		setCopied(true);
		toast.success("Prompt copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	}

	function handleDelete() {
		if (!confirm("Are you sure you want to delete this prompt?")) {
			return;
		}

		startDeleteTransition(async () => {
			try {
				await deletePrompt({ id: prompt.id });
				toast.success("Prompt deleted successfully");
				router.refresh();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to delete prompt",
				);
			}
		});
	}

	return (
		<div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#C4B5FD] hover:shadow-lg">
			{/* Category badge and favorite */}
			<div className="mb-4 flex items-center justify-between">
				<span
					className={`rounded-full px-3 py-1 font-medium text-xs ${colors.bg} ${colors.text}`}
				>
					{prompt.category}
				</span>
				<FavoriteButton
					initialCount={prompt.favoritesCount}
					initialFavorited={isFavorited}
					isLoggedIn={isLoggedIn}
					promptId={prompt.id}
				/>
			</div>

			{/* Title */}
			<h3 className="mb-2 line-clamp-2 font-bold text-[#1a1a1a] text-lg">
				{prompt.title}
			</h3>

			{/* Content preview */}
			<p className="mb-4 line-clamp-3 flex-1 text-gray-500 text-sm">
				{prompt.content}
			</p>

			{/* Tags */}
			<div className="mb-4 flex flex-wrap gap-2">
				{prompt.tags.slice(0, 3).map((tag) => (
					<span
						className="rounded-md bg-gray-50 px-2 py-1 text-gray-500 text-xs"
						key={tag}
					>
						#{tag}
					</span>
				))}
				{prompt.tags.length > 3 && (
					<span className="rounded-md bg-gray-50 px-2 py-1 text-gray-400 text-xs">
						+{prompt.tags.length - 3}
					</span>
				)}
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between border-gray-50 border-t pt-4">
				<span className="text-gray-400 text-sm">by {prompt.author}</span>
				<div className="flex items-center gap-2">
					{isOwner && (
						<>
							<Button
								asChild
								className="text-gray-500 hover:text-[#1a1a1a]"
								size="sm"
								variant="ghost"
							>
								<Link href={`/prompts/${prompt.id}/edit`}>
									<Edit className="h-4 w-4" />
								</Link>
							</Button>
							<Button
								className="text-gray-500 hover:text-red-500"
								disabled={isDeleting}
								onClick={handleDelete}
								size="sm"
								variant="ghost"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</>
					)}
					<Button
						className="rounded-lg bg-[#F3E8FF] text-[#6D28D9] transition-colors hover:bg-[#E9D5FF]"
						onClick={handleCopy}
						size="sm"
						variant="ghost"
					>
						{copied ? (
							<>
								<Check className="mr-1 h-4 w-4" />
								Copied
							</>
						) : (
							<>
								<Copy className="mr-1 h-4 w-4" />
								Copy
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
