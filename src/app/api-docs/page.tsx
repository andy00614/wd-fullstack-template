import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MethodBadge } from "@/modules/api-docs/components";
import { apiGroups } from "@/modules/api-docs/data/endpoints";

export default function ApiDocsPage() {
	return (
		<div className="mx-auto max-w-4xl px-8 py-12">
			<div className="space-y-8">
				{/* Header */}
				<div className="space-y-4">
					<h1 className="font-semibold text-3xl text-gray-900 tracking-tight dark:text-gray-100">
						API Reference
					</h1>
					<p className="text-gray-600 text-lg dark:text-gray-400">
						Explore and test our REST API endpoints. Each endpoint includes
						documentation and an interactive playground.
					</p>
				</div>

				{/* Quick Stats */}
				<div className="flex gap-6 border-gray-100 border-b pb-6 dark:border-gray-800">
					<div>
						<span className="font-semibold text-2xl text-gray-900 dark:text-gray-100">
							{apiGroups.reduce((acc, g) => acc + g.endpoints.length, 0)}
						</span>
						<span className="ml-2 text-gray-500 dark:text-gray-400">
							Endpoints
						</span>
					</div>
					<div>
						<span className="font-semibold text-2xl text-gray-900 dark:text-gray-100">
							{apiGroups.length}
						</span>
						<span className="ml-2 text-gray-500 dark:text-gray-400">
							Categories
						</span>
					</div>
				</div>

				{/* Endpoint Groups */}
				<div className="space-y-8">
					{apiGroups.map((group) => (
						<div className="space-y-4" key={group.id}>
							<div>
								<h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
									{group.name}
								</h2>
								<p className="text-gray-500 text-sm dark:text-gray-400">
									{group.description}
								</p>
							</div>

							<div className="grid gap-3">
								{group.endpoints.map((endpoint) => (
									<Link href={`/api-docs/${endpoint.id}`} key={endpoint.id}>
										<Card className="cursor-pointer transition-colors hover:border-gray-300 dark:hover:border-gray-600">
											<CardContent className="flex items-center gap-4 p-4">
												<MethodBadge method={endpoint.method} />
												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2">
														<code className="font-mono text-gray-900 text-sm dark:text-gray-100">
															{endpoint.path}
														</code>
													</div>
													<p className="truncate text-gray-500 text-sm dark:text-gray-400">
														{endpoint.title}
													</p>
												</div>
												<ChevronRight className="h-5 w-5 text-gray-400" />
											</CardContent>
										</Card>
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
