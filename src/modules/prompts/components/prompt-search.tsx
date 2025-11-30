"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
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
];

export function PromptSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [activeCategory, setActiveCategory] = useState(
		searchParams.get("category") || "All",
	);

	const updateSearch = useCallback(
		(newQuery: string, newCategory: string) => {
			startTransition(() => {
				const params = new URLSearchParams();
				if (newQuery) params.set("q", newQuery);
				if (newCategory && newCategory !== "All")
					params.set("category", newCategory);

				const queryString = params.toString();
				router.push(`/prompts${queryString ? `?${queryString}` : ""}`);
			});
		},
		[router],
	);

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		updateSearch(query, activeCategory);
	}

	function handleCategoryChange(category: string) {
		setActiveCategory(category);
		updateSearch(query, category);
	}

	function handleClear() {
		setQuery("");
		setActiveCategory("All");
		router.push("/prompts");
	}

	const hasFilters = query || activeCategory !== "All";

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

			{/* Loading indicator */}
			{isPending && (
				<div className="flex items-center gap-2 text-gray-500 text-sm">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#6D28D9]" />
					Searching...
				</div>
			)}
		</div>
	);
}
