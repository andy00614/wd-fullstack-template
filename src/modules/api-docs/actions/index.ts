"use server";

import { executeRequestSchema } from "../schemas";
import type { ApiResponse, ExecuteRequest } from "../types";

export async function executeApiRequest(
	input: ExecuteRequest,
): Promise<ApiResponse> {
	const validated = executeRequestSchema.parse(input);

	const start = performance.now();

	try {
		const headers: Record<string, string> = validated.headers ?? {};
		const response = await fetch(validated.url, {
			method: validated.method,
			headers,
			body:
				validated.body && validated.method !== "GET"
					? JSON.stringify(validated.body)
					: undefined,
		});

		const duration = performance.now() - start;

		const responseHeaders: Record<string, string> = {};
		response.headers.forEach((value, key) => {
			responseHeaders[key] = value;
		});

		let body: unknown;
		const contentType = response.headers.get("content-type");
		if (contentType?.includes("application/json")) {
			try {
				body = await response.json();
			} catch {
				body = await response.text();
			}
		} else {
			body = await response.text();
		}

		return {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
			body,
			duration: Math.round(duration),
		};
	} catch (error) {
		const duration = performance.now() - start;
		return {
			status: 0,
			statusText: "Network Error",
			headers: {},
			body: error instanceof Error ? error.message : "Request failed",
			duration: Math.round(duration),
		};
	}
}
