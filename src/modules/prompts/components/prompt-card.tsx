"use client";

import { Check, Copy, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Prompt } from "../types";

interface PromptCardProps {
	prompt: Prompt;
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

export function PromptCard({ prompt }: PromptCardProps) {
	const [copied, setCopied] = useState(false);
	const colors = categoryColors[prompt.category] ??
		categoryColors.Default ?? { bg: "bg-gray-100", text: "text-gray-600" };

	async function handleCopy() {
		await navigator.clipboard.writeText(prompt.content);
		setCopied(true);
		toast.success("Prompt copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#C4B5FD] hover:shadow-lg">
			{/* Category badge */}
			<div className="mb-4 flex items-center justify-between">
				<span
					className={`rounded-full px-3 py-1 font-medium text-xs ${colors.bg} ${colors.text}`}
				>
					{prompt.category}
				</span>
				<div className="flex items-center gap-1 text-gray-400">
					<Heart className="h-4 w-4" />
					<span className="text-sm">{prompt.favoritesCount}</span>
				</div>
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
	);
}
