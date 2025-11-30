"use client";

import { Heart, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "../actions";

interface FavoriteButtonProps {
	promptId: string;
	isFavorited: boolean;
	favoritesCount: number;
	isLoggedIn: boolean;
}

export function FavoriteButton({
	promptId,
	isFavorited,
	favoritesCount,
	isLoggedIn,
}: FavoriteButtonProps) {
	const [isPending, startTransition] = useTransition();

	function handleToggle() {
		if (!isLoggedIn) {
			toast.error("Please sign in to favorite prompts");
			return;
		}

		startTransition(async () => {
			const formData = new FormData();
			formData.set("promptId", promptId);
			const result = await toggleFavorite(formData);
			toast.success(
				result.favorited ? "Added to favorites" : "Removed from favorites",
			);
		});
	}

	return (
		<Button
			className={`gap-1 ${
				isFavorited
					? "bg-red-50 text-red-500 hover:bg-red-100"
					: "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500"
			}`}
			disabled={isPending}
			onClick={handleToggle}
			size="sm"
			variant="ghost"
		>
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
			)}
			<span className="text-sm">{favoritesCount}</span>
		</Button>
	);
}
