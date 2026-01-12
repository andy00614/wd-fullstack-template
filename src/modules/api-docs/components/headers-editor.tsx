"use client";

import { Plus, X } from "lucide-react";
import { useId, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeadersEditorProps {
	headers: Record<string, string>;
	onChange: (headers: Record<string, string>) => void;
}

interface HeaderEntry {
	id: string;
	key: string;
	value: string;
}

export function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
	const baseId = useId();

	// Convert object to array with stable IDs based on position
	const entries: HeaderEntry[] = useMemo(() => {
		return Object.entries(headers).map(([key, value], idx) => ({
			id: `${baseId}-${idx}`,
			key,
			value,
		}));
	}, [headers, baseId]);

	const addHeader = () => {
		onChange({ ...headers, "": "" });
	};

	const updateHeader = (index: number, newKey: string, value: string) => {
		const newHeaders: Record<string, string> = {};
		let i = 0;
		for (const [key, val] of Object.entries(headers)) {
			if (i === index) {
				if (newKey) {
					newHeaders[newKey] = value;
				}
			} else {
				newHeaders[key] = val;
			}
			i++;
		}
		onChange(newHeaders);
	};

	const removeHeader = (index: number) => {
		const newHeaders: Record<string, string> = {};
		let i = 0;
		for (const [key, val] of Object.entries(headers)) {
			if (i !== index) {
				newHeaders[key] = val;
			}
			i++;
		}
		onChange(newHeaders);
	};

	return (
		<div className="space-y-3">
			<div className="space-y-2">
				{entries.map((entry, index) => (
					<div className="flex items-center gap-2" key={entry.id}>
						<Input
							className="h-9 flex-1 font-mono text-sm"
							onChange={(e) => updateHeader(index, e.target.value, entry.value)}
							placeholder="Header name"
							value={entry.key}
						/>
						<Input
							className="h-9 flex-1 text-sm"
							onChange={(e) => updateHeader(index, entry.key, e.target.value)}
							placeholder="Value"
							value={entry.value}
						/>
						<Button
							className="h-9 w-9 shrink-0"
							onClick={() => removeHeader(index)}
							size="icon"
							variant="ghost"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
			<Button
				className="w-full"
				onClick={addHeader}
				size="sm"
				variant="outline"
			>
				<Plus className="mr-2 h-4 w-4" />
				Add Header
			</Button>
		</div>
	);
}
