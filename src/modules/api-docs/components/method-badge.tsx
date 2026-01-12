import type { HttpMethod } from "../types";

const methodStyles: Record<HttpMethod, string> = {
	GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	PATCH:
		"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

interface MethodBadgeProps {
	method: HttpMethod;
	size?: "sm" | "md";
}

export function MethodBadge({ method, size = "md" }: MethodBadgeProps) {
	const sizeStyles =
		size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs";

	return (
		<span
			className={`inline-flex items-center rounded-md font-mono font-semibold ${sizeStyles} ${methodStyles[method]}`}
		>
			{method}
		</span>
	);
}
