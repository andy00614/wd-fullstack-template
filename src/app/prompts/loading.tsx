export default function PromptsLoading() {
	return (
		<main className="min-h-screen bg-white">
			{/* Header skeleton */}
			<div className="border-gray-100 border-b">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
					<div className="h-8 w-32 animate-pulse rounded bg-gray-100" />
					<div className="h-8 w-28 animate-pulse rounded bg-gray-100" />
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-6 py-12">
				{/* Title skeleton */}
				<div className="mb-12 flex flex-col items-center gap-4">
					<div className="h-12 w-80 animate-pulse rounded bg-gray-100" />
					<div className="h-6 w-96 animate-pulse rounded bg-gray-100" />
				</div>

				{/* Search skeleton */}
				<div className="mb-12 space-y-6">
					<div className="h-14 w-full animate-pulse rounded-2xl bg-gray-100" />
					<div className="flex gap-2">
						{[
							"all",
							"writing",
							"coding",
							"marketing",
							"business",
							"creative",
							"education",
						].map((cat) => (
							<div
								className="h-10 w-20 animate-pulse rounded-full bg-gray-100"
								key={cat}
							/>
						))}
					</div>
				</div>

				{/* Results skeleton */}
				<div className="mb-6">
					<div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
				</div>

				{/* Cards skeleton */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{["card-1", "card-2", "card-3", "card-4", "card-5", "card-6"].map(
						(id) => (
							<div
								className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6"
								key={id}
							>
								<div className="mb-4 flex items-center justify-between">
									<div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
									<div className="h-5 w-12 animate-pulse rounded bg-gray-100" />
								</div>
								<div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-100" />
								<div className="mb-4 space-y-2">
									<div className="h-4 w-full animate-pulse rounded bg-gray-100" />
									<div className="h-4 w-full animate-pulse rounded bg-gray-100" />
									<div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
								</div>
								<div className="mb-4 flex gap-2">
									<div className="h-6 w-14 animate-pulse rounded bg-gray-100" />
									<div className="h-6 w-14 animate-pulse rounded bg-gray-100" />
								</div>
								<div className="flex items-center justify-between border-gray-50 border-t pt-4">
									<div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
									<div className="h-8 w-16 animate-pulse rounded-lg bg-gray-100" />
								</div>
							</div>
						),
					)}
				</div>
			</div>
		</main>
	);
}
