"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ApiGroup } from "../types";
import { MethodBadge } from "./method-badge";

interface ApiSidebarProps {
	groups: ApiGroup[];
}

export function ApiSidebar({ groups }: ApiSidebarProps) {
	const pathname = usePathname();

	return (
		<aside className="w-60 shrink-0 border-gray-100 border-r bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
			<div className="sticky top-0 h-screen overflow-y-auto p-4">
				<div className="space-y-6">
					<div>
						<Link
							className="font-semibold text-gray-900 text-lg tracking-tight dark:text-gray-100"
							href="/api-docs"
						>
							API Reference
						</Link>
					</div>

					<nav className="space-y-6">
						{groups.map((group) => (
							<div className="space-y-2" key={group.id}>
								<h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">
									{group.name}
								</h3>
								<ul className="space-y-1">
									{group.endpoints.map((endpoint) => {
										const href = `/api-docs/${endpoint.id}`;
										const isActive = pathname === href;

										return (
											<li key={endpoint.id}>
												<Link
													className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
														isActive
															? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
															: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"
													}`}
													href={href}
												>
													<MethodBadge method={endpoint.method} size="sm" />
													<span className="truncate font-mono text-xs">
														{endpoint.path}
													</span>
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						))}
					</nav>
				</div>
			</div>
		</aside>
	);
}
