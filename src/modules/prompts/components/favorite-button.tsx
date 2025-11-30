"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { favoritePrompt, unfavoritePrompt } from "../actions";

interface FavoriteButtonProps {
	promptId: string;
	initialFavorited: boolean;
	initialCount: number;
	isLoggedIn: boolean;
}

export function FavoriteButton({
	promptId,
	initialFavorited,
	initialCount,
	isLoggedIn,
}: FavoriteButtonProps) {
	const [isPending, startTransition] = useTransition();
	const [isFavorited, setIsFavorited] = useState(initialFavorited);
	const [count, setCount] = useState(initialCount);

	function handleToggle() {
		if (!isLoggedIn) {
			toast.error("Please log in to favorite prompts");
			return;
		}

		startTransition(async () => {
			if (isFavorited) {
				const result = await unfavoritePrompt({ promptId });
				if ("success" in result) {
					setIsFavorited(false);
					setCount((c) => Math.max(0, c - 1));
					toast.success("Removed from favorites");
				}
			} else {
				const result = await favoritePrompt({ promptId });
				if ("success" in result) {
					setIsFavorited(true);
					setCount((c) => c + 1);
					toast.success("Added to favorites");
				}
			}
		});
	}

	return (
		<Button
			className={`gap-1 ${
				isFavorited
					? "text-red-500 hover:text-red-600"
					: "text-gray-400 hover:text-red-500"
			}`}
			disabled={isPending}
			onClick={handleToggle}
			size="sm"
			variant="ghost"
		>
			<Heart
				className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
			/>
			<span className="text-sm">{count}</span>
		</Button>
	);
}
