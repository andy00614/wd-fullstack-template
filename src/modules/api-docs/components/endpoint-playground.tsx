"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { executeApiRequest } from "../actions";
import type { ApiResponse, Endpoint } from "../types";
import { HeadersEditor } from "./headers-editor";
import { MethodBadge } from "./method-badge";
import { RequestBodyEditor } from "./request-body-editor";
import { ResponseViewer } from "./response-viewer";

interface EndpointPlaygroundProps {
	endpoint: Endpoint;
	baseUrl?: string;
}

type Tab = "params" | "headers" | "body";

export function EndpointPlayground({
	endpoint,
	baseUrl = "",
}: EndpointPlaygroundProps) {
	const [activeTab, setActiveTab] = useState<Tab>("params");
	const [url, setUrl] = useState(baseUrl + endpoint.path);
	const [headers, setHeaders] = useState<Record<string, string>>({
		"Content-Type": "application/json",
	});
	const [body, setBody] = useState(
		endpoint.requestBodyExample
			? JSON.stringify(endpoint.requestBodyExample, null, 2)
			: "",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState<ApiResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	const showBodyTab =
		endpoint.method === "POST" ||
		endpoint.method === "PUT" ||
		endpoint.method === "PATCH";

	const handleExecute = async () => {
		setIsLoading(true);
		setError(null);
		setResponse(null);

		try {
			let parsedBody: unknown;
			if (showBodyTab && body.trim()) {
				try {
					parsedBody = JSON.parse(body);
				} catch {
					throw new Error("Invalid JSON in request body");
				}
			}

			const result = await executeApiRequest({
				method: endpoint.method,
				url,
				headers,
				body: parsedBody,
			});
			setResponse(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Request failed");
		} finally {
			setIsLoading(false);
		}
	};

	const tabs: { id: Tab; label: string; show: boolean }[] = [
		{ id: "params", label: "Params", show: true },
		{ id: "headers", label: "Headers", show: true },
		{ id: "body", label: "Body", show: showBodyTab },
	];

	return (
		<div className="space-y-6">
			{/* Request Section */}
			<div className="space-y-4">
				<h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">
					Request
				</h3>

				{/* URL Bar */}
				<div className="flex items-center gap-2">
					<MethodBadge method={endpoint.method} />
					<Input
						className="flex-1 font-mono text-sm"
						onChange={(e) => setUrl(e.target.value)}
						value={url}
					/>
					<Button
						className="gap-2"
						disabled={isLoading}
						onClick={handleExecute}
					>
						<Play className="h-4 w-4" />
						{isLoading ? "Sending..." : "Send"}
					</Button>
				</div>

				{/* Tabs */}
				<div className="border-gray-100 border-b dark:border-gray-800">
					<div className="flex gap-4">
						{tabs
							.filter((tab) => tab.show)
							.map((tab) => (
								<button
									className={`-mb-px border-b-2 pb-2 font-medium text-sm transition-colors ${
										activeTab === tab.id
											? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
											: "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
									}`}
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									type="button"
								>
									{tab.label}
								</button>
							))}
					</div>
				</div>

				{/* Tab Content */}
				<div className="min-h-[120px]">
					{activeTab === "params" && (
						<div className="space-y-3">
							{endpoint.queryParameters &&
							endpoint.queryParameters.length > 0 ? (
								<div className="space-y-2">
									{endpoint.queryParameters.map((param) => (
										<div className="flex items-center gap-2" key={param.name}>
											<Input
												className="h-9 flex-1 bg-gray-50 font-mono text-sm dark:bg-gray-900"
												disabled
												value={param.name}
											/>
											<Input
												className="h-9 flex-1 text-sm"
												placeholder={String(param.example || param.type)}
											/>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-sm dark:text-gray-400">
									No query parameters
								</p>
							)}
						</div>
					)}

					{activeTab === "headers" && (
						<HeadersEditor headers={headers} onChange={setHeaders} />
					)}

					{activeTab === "body" && showBodyTab && (
						<RequestBodyEditor onChange={setBody} value={body} />
					)}
				</div>
			</div>

			{/* Response Section */}
			<div className="space-y-4">
				<h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">
					Response
				</h3>
				<ResponseViewer
					error={error}
					isLoading={isLoading}
					response={response}
				/>
			</div>
		</div>
	);
}
