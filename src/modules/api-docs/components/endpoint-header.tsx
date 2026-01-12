import type { Endpoint } from "../types";
import { MethodBadge } from "./method-badge";

interface EndpointHeaderProps {
	endpoint: Endpoint;
}

export function EndpointHeader({ endpoint }: EndpointHeaderProps) {
	return (
		<div className="space-y-4 border-gray-100 border-b pb-6 dark:border-gray-800">
			<div className="flex items-center gap-3">
				<MethodBadge method={endpoint.method} />
				<code className="font-mono text-gray-900 text-lg dark:text-gray-100">
					{endpoint.path}
				</code>
			</div>
			<div className="space-y-2">
				<h1 className="font-semibold text-2xl text-gray-900 tracking-tight dark:text-gray-100">
					{endpoint.title}
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					{endpoint.description}
				</p>
			</div>
		</div>
	);
}
