import type { z } from "zod";
import type {
	apiGroupSchema,
	apiResponseSchema,
	endpointSchema,
	executeRequestSchema,
	httpMethodSchema,
	parameterSchema,
	responseExampleSchema,
} from "./schemas";

export type HttpMethod = z.infer<typeof httpMethodSchema>;
export type Parameter = z.infer<typeof parameterSchema>;
export type ResponseExample = z.infer<typeof responseExampleSchema>;
export type Endpoint = z.infer<typeof endpointSchema>;
export type ApiGroup = z.infer<typeof apiGroupSchema>;
export type ExecuteRequest = z.infer<typeof executeRequestSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;

export interface PlaygroundState {
	method: HttpMethod;
	url: string;
	headers: Record<string, string>;
	body: string;
	isLoading: boolean;
	response: ApiResponse | null;
	error: string | null;
}
