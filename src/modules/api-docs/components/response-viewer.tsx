"use client";

import type { ApiResponse } from "../types";
import { CodeBlock } from "./code-block";

interface ResponseViewerProps {
	response: ApiResponse | null;
	isLoading: boolean;
	error: string | null;
}

export function ResponseViewer({
	response,
	isLoading,
	error,
}: ResponseViewerProps) {
	if (isLoading) {
		return (
			<div className="space-y-3">
				<div className="flex items-center gap-3">
					<div className="h-6 w-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
					<div className="h-4 w-12 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
				</div>
				<div className="h-32 animate-pulse rounded-lg bg-gray-50 dark:bg-gray-900" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<span className="rounded-md bg-red-100 px-2 py-1 font-medium text-red-700 text-xs dark:bg-red-900/30 dark:text-red-400">
						Error
					</span>
				</div>
				<div className="rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
					<p className="text-red-700 text-sm dark:text-red-400">{error}</p>
				</div>
			</div>
		);
	}

	if (!response) {
		return (
			<div className="rounded-lg border border-gray-100 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
				<p className="text-gray-500 text-sm dark:text-gray-400">
					Click "Send Request" to see the response
				</p>
			</div>
		);
	}

	const statusColor = getStatusColor(response.status);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<span
					className={`rounded-md px-2 py-1 font-medium text-xs ${statusColor}`}
				>
					{response.status} {response.statusText}
				</span>
				<span className="text-gray-500 text-xs dark:text-gray-400">
					{response.duration}ms
				</span>
			</div>
			<CodeBlock
				code={
					typeof response.body === "string"
						? response.body
						: JSON.stringify(response.body, null, 2)
				}
			/>
		</div>
	);
}

function getStatusColor(status: number): string {
	if (status >= 200 && status < 300) {
		return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
	}
	if (status >= 300 && status < 400) {
		return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
	}
	if (status >= 400 && status < 500) {
		return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
	}
	return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
}
