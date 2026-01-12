import { Badge } from "@/components/ui/badge";
import type { Parameter } from "../types";

interface ParametersTableProps {
	title: string;
	parameters: Parameter[];
}

export function ParametersTable({ title, parameters }: ParametersTableProps) {
	if (parameters.length === 0) return null;

	return (
		<div className="space-y-3">
			<h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">
				{title}
			</h3>
			<div className="overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
				<table className="w-full text-sm">
					<thead>
						<tr className="bg-gray-50 dark:bg-gray-900/50">
							<th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
								Name
							</th>
							<th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
								Type
							</th>
							<th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
								Description
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
						{parameters.map((param) => (
							<tr key={param.name}>
								<td className="px-4 py-3">
									<div className="flex items-center gap-2">
										<code className="font-mono text-gray-900 text-sm dark:text-gray-100">
											{param.name}
										</code>
										{param.required && (
											<Badge
												className="px-1.5 py-0 text-xs"
												variant="secondary"
											>
												required
											</Badge>
										)}
									</div>
								</td>
								<td className="px-4 py-3">
									<code className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600 text-xs dark:bg-gray-800 dark:text-gray-400">
										{param.type}
									</code>
								</td>
								<td className="px-4 py-3 text-gray-600 dark:text-gray-400">
									{param.description}
									{param.example !== undefined && (
										<span className="ml-2 text-gray-400 dark:text-gray-500">
											e.g.{" "}
											<code className="text-xs">{String(param.example)}</code>
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
