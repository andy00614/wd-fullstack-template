import { z } from "zod";

export const httpMethodSchema = z.enum([
	"GET",
	"POST",
	"PUT",
	"DELETE",
	"PATCH",
]);

export const parameterSchema = z.object({
	name: z.string(),
	type: z.enum(["string", "number", "boolean", "object", "array"]),
	required: z.boolean(),
	description: z.string(),
	example: z.unknown().optional(),
});

export const responseExampleSchema = z.object({
	statusCode: z.number(),
	description: z.string(),
	body: z.unknown(),
});

export const endpointSchema = z.object({
	id: z.string(),
	method: httpMethodSchema,
	path: z.string(),
	title: z.string(),
	description: z.string(),
	group: z.string(),
	pathParameters: z.array(parameterSchema).optional(),
	queryParameters: z.array(parameterSchema).optional(),
	bodyParameters: z.array(parameterSchema).optional(),
	requestBodyExample: z.unknown().optional(),
	responses: z.array(responseExampleSchema),
});

export const apiGroupSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	endpoints: z.array(endpointSchema),
});

export const executeRequestSchema = z.object({
	method: httpMethodSchema,
	url: z.string(),
	headers: z.record(z.string(), z.string()).optional(),
	body: z.unknown().optional(),
});

export const apiResponseSchema = z.object({
	status: z.number(),
	statusText: z.string(),
	headers: z.record(z.string(), z.string()),
	body: z.unknown(),
	duration: z.number(),
});
