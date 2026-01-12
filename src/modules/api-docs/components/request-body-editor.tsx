"use client";

import { Textarea } from "@/components/ui/textarea";

interface RequestBodyEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export function RequestBodyEditor({ value, onChange }: RequestBodyEditorProps) {
	const handleFormat = () => {
		try {
			const parsed = JSON.parse(value);
			onChange(JSON.stringify(parsed, null, 2));
		} catch {
			// Invalid JSON, don't format
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-gray-500 text-xs dark:text-gray-400">
					JSON Body
				</span>
				<button
					className="text-gray-500 text-xs transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					onClick={handleFormat}
					type="button"
				>
					Format
				</button>
			</div>
			<Textarea
				className="min-h-[200px] resize-y font-mono text-sm"
				onChange={(e) => onChange(e.target.value)}
				placeholder='{ "key": "value" }'
				value={value}
			/>
		</div>
	);
}
