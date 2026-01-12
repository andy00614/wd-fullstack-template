"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
	code: string;
	language?: string;
	showCopy?: boolean;
}

export function CodeBlock({
	code,
	language = "json",
	showCopy = true,
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const formattedCode = language === "json" ? formatJson(code) : code;

	return (
		<div className="group relative">
			<pre className="overflow-x-auto rounded-lg border border-gray-100 bg-gray-50 p-4 font-mono text-sm dark:border-gray-800 dark:bg-gray-900">
				<code className="text-gray-800 dark:text-gray-200">
					{formattedCode}
				</code>
			</pre>
			{showCopy && (
				<Button
					className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
					onClick={handleCopy}
					size="icon"
					variant="ghost"
				>
					{copied ? (
						<Check className="h-4 w-4 text-emerald-500" />
					) : (
						<Copy className="h-4 w-4" />
					)}
				</Button>
			)}
		</div>
	);
}

function formatJson(code: string): string {
	try {
		const parsed = JSON.parse(code);
		return JSON.stringify(parsed, null, 2);
	} catch {
		return code;
	}
}
