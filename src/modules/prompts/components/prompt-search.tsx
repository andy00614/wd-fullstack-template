"use client";

import { Heart, Search, User, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
	"All",
	"Writing",
	"Coding",
	"Marketing",
	"Business",
	"Creative",
	"Education",
	"Analysis",
	"Translation",
];

interface PromptSearchProps {
	isLoggedIn?: boolean;
}

export function PromptSearch({ isLoggedIn = false }: PromptSearchProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [activeCategory, setActiveCategory] = useState(
		searchParams.get("category") || "All",
	);
	const [showFavorites, setShowFavorites] = useState(
		searchParams.get("favorites") === "true",
	);
	const [showMine, setShowMine] = useState(searchParams.get("mine") === "true");

	const updateSearch = useCallback(
		(
			newQuery: string,
			newCategory: string,
			favorites: boolean,
			mine: boolean,
		) => {
			const params = new URLSearchParams();
			if (newQuery) params.set("q", newQuery);
			if (newCategory && newCategory !== "All")
				params.set("category", newCategory);
			if (favorites) params.set("favorites", "true");
			if (mine) params.set("mine", "true");

			const queryString = params.toString();
			router.push(`/prompts${queryString ? `?${queryString}` : ""}`);
		},
		[router],
	);

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		updateSearch(query, activeCategory, showFavorites, showMine);
	}

	function handleCategoryChange(category: string) {
		setActiveCategory(category);
		updateSearch(query, category, showFavorites, showMine);
	}

	function handleFavoritesToggle() {
		const newValue = !showFavorites;
		setShowFavorites(newValue);
		updateSearch(query, activeCategory, newValue, showMine);
	}

	function handleMineToggle() {
		const newValue = !showMine;
		setShowMine(newValue);
		updateSearch(query, activeCategory, showFavorites, newValue);
	}

	function handleClear() {
		setQuery("");
		setActiveCategory("All");
		setShowFavorites(false);
		setShowMine(false);
		router.push("/prompts");
	}

	const hasFilters =
		query || activeCategory !== "All" || showFavorites || showMine;

	return (
		<div className="space-y-6">
			{/* Search input */}
			<form className="relative" onSubmit={handleSearch}>
				<Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-gray-400" />
				<Input
					className="h-14 rounded-2xl border-gray-200 bg-white pr-12 pl-12 text-[#1a1a1a] text-lg placeholder:text-gray-400 focus:border-[#C4B5FD] focus:ring-[#C4B5FD]"
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search prompts..."
					type="search"
					value={query}
				/>
				{hasFilters && (
					<Button
						className="-translate-y-1/2 absolute top-1/2 right-2 text-gray-400 hover:text-gray-600"
						onClick={handleClear}
						size="icon"
						type="button"
						variant="ghost"
					>
						<X className="h-5 w-5" />
					</Button>
				)}
			</form>

			{/* Filter buttons row */}
			<div className="flex flex-wrap items-center gap-4">
				{/* Category filters */}
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => (
						<button
							className={`rounded-full px-4 py-2 font-medium text-sm transition-all ${
								activeCategory === category
									? "bg-black text-white"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
							key={category}
							onClick={() => handleCategoryChange(category)}
							type="button"
						>
							{category}
						</button>
					))}
				</div>

				{/* Separator */}
				{isLoggedIn && <div className="h-8 w-px bg-gray-200" />}

				{/* User filters */}
				{isLoggedIn && (
					<div className="flex gap-2">
						<button
							className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm transition-all ${
								showFavorites
									? "bg-red-500 text-white"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
							onClick={handleFavoritesToggle}
							type="button"
						>
							<Heart
								className={`h-4 w-4 ${showFavorites ? "fill-current" : ""}`}
							/>
							Favorites
						</button>
						<button
							className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm transition-all ${
								showMine
									? "bg-[#6D28D9] text-white"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
							onClick={handleMineToggle}
							type="button"
						>
							<User className="h-4 w-4" />
							My Prompts
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
