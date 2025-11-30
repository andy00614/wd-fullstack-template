export function PromptCardSkeleton() {
	return (
		<div className="flex animate-pulse flex-col rounded-2xl border border-gray-100 bg-white p-6">
			{/* Category badge and favorite */}
			<div className="mb-4 flex items-center justify-between">
				<div className="h-6 w-16 rounded-full bg-gray-200" />
				<div className="h-6 w-12 rounded-lg bg-gray-200" />
			</div>

			{/* Title */}
			<div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
			<div className="mb-4 h-6 w-1/2 rounded bg-gray-200" />

			{/* Content preview */}
			<div className="mb-4 flex-1 space-y-2">
				<div className="h-4 w-full rounded bg-gray-100" />
				<div className="h-4 w-full rounded bg-gray-100" />
				<div className="h-4 w-2/3 rounded bg-gray-100" />
			</div>

			{/* Tags */}
			<div className="mb-4 flex gap-2">
				<div className="h-6 w-14 rounded-md bg-gray-100" />
				<div className="h-6 w-16 rounded-md bg-gray-100" />
				<div className="h-6 w-12 rounded-md bg-gray-100" />
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between border-gray-50 border-t pt-4">
				<div className="h-4 w-24 rounded bg-gray-100" />
				<div className="h-8 w-20 rounded-lg bg-gray-200" />
			</div>
		</div>
	);
}

export function PromptListSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: count }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
				<PromptCardSkeleton key={i} />
			))}
		</div>
	);
}
