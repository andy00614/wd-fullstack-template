import type { ApiGroup } from "../types";

export const apiGroups: ApiGroup[] = [
	{
		id: "users",
		name: "Users",
		description: "User management endpoints",
		endpoints: [
			{
				id: "list-users",
				method: "GET",
				path: "/api/users",
				title: "List Users",
				description: "Retrieve a list of all users with pagination support.",
				group: "users",
				queryParameters: [
					{
						name: "page",
						type: "number",
						required: false,
						description: "Page number for pagination",
						example: 1,
					},
					{
						name: "limit",
						type: "number",
						required: false,
						description: "Number of items per page",
						example: 10,
					},
				],
				responses: [
					{
						statusCode: 200,
						description: "Successful response",
						body: {
							users: [
								{ id: 1, name: "John Doe", email: "john@example.com" },
								{ id: 2, name: "Jane Smith", email: "jane@example.com" },
							],
							total: 2,
							page: 1,
						},
					},
				],
			},
			{
				id: "get-user",
				method: "GET",
				path: "/api/users/:id",
				title: "Get User",
				description: "Retrieve a single user by their ID.",
				group: "users",
				pathParameters: [
					{
						name: "id",
						type: "string",
						required: true,
						description: "The user's unique identifier",
						example: "usr_123",
					},
				],
				responses: [
					{
						statusCode: 200,
						description: "Successful response",
						body: {
							id: 1,
							name: "John Doe",
							email: "john@example.com",
							createdAt: "2024-01-15T10:30:00Z",
						},
					},
					{
						statusCode: 404,
						description: "User not found",
						body: { error: "User not found" },
					},
				],
			},
			{
				id: "create-user",
				method: "POST",
				path: "/api/users",
				title: "Create User",
				description: "Create a new user account.",
				group: "users",
				bodyParameters: [
					{
						name: "name",
						type: "string",
						required: true,
						description: "The user's full name",
						example: "John Doe",
					},
					{
						name: "email",
						type: "string",
						required: true,
						description: "The user's email address",
						example: "john@example.com",
					},
					{
						name: "role",
						type: "string",
						required: false,
						description: "The user's role (admin, user)",
						example: "user",
					},
				],
				requestBodyExample: {
					name: "John Doe",
					email: "john@example.com",
					role: "user",
				},
				responses: [
					{
						statusCode: 201,
						description: "User created successfully",
						body: {
							id: 1,
							name: "John Doe",
							email: "john@example.com",
							role: "user",
							createdAt: "2024-01-15T10:30:00Z",
						},
					},
					{
						statusCode: 400,
						description: "Validation error",
						body: { error: "Email already exists" },
					},
				],
			},
			{
				id: "update-user",
				method: "PUT",
				path: "/api/users/:id",
				title: "Update User",
				description: "Update an existing user's information.",
				group: "users",
				pathParameters: [
					{
						name: "id",
						type: "string",
						required: true,
						description: "The user's unique identifier",
						example: "usr_123",
					},
				],
				bodyParameters: [
					{
						name: "name",
						type: "string",
						required: false,
						description: "The user's full name",
						example: "John Doe",
					},
					{
						name: "email",
						type: "string",
						required: false,
						description: "The user's email address",
						example: "john@example.com",
					},
				],
				requestBodyExample: {
					name: "John Updated",
				},
				responses: [
					{
						statusCode: 200,
						description: "User updated successfully",
						body: {
							id: 1,
							name: "John Updated",
							email: "john@example.com",
							updatedAt: "2024-01-15T11:00:00Z",
						},
					},
				],
			},
			{
				id: "delete-user",
				method: "DELETE",
				path: "/api/users/:id",
				title: "Delete User",
				description: "Permanently delete a user account.",
				group: "users",
				pathParameters: [
					{
						name: "id",
						type: "string",
						required: true,
						description: "The user's unique identifier",
						example: "usr_123",
					},
				],
				responses: [
					{
						statusCode: 204,
						description: "User deleted successfully",
						body: null,
					},
					{
						statusCode: 404,
						description: "User not found",
						body: { error: "User not found" },
					},
				],
			},
		],
	},
	{
		id: "posts",
		name: "Posts",
		description: "Blog post management endpoints",
		endpoints: [
			{
				id: "list-posts",
				method: "GET",
				path: "/api/posts",
				title: "List Posts",
				description: "Retrieve a list of all published posts.",
				group: "posts",
				queryParameters: [
					{
						name: "status",
						type: "string",
						required: false,
						description: "Filter by status (draft, published)",
						example: "published",
					},
				],
				responses: [
					{
						statusCode: 200,
						description: "Successful response",
						body: {
							posts: [
								{
									id: 1,
									title: "Hello World",
									status: "published",
									createdAt: "2024-01-15T10:30:00Z",
								},
							],
						},
					},
				],
			},
			{
				id: "create-post",
				method: "POST",
				path: "/api/posts",
				title: "Create Post",
				description: "Create a new blog post.",
				group: "posts",
				bodyParameters: [
					{
						name: "title",
						type: "string",
						required: true,
						description: "The post title",
						example: "My New Post",
					},
					{
						name: "content",
						type: "string",
						required: true,
						description: "The post content in markdown",
						example: "# Hello\n\nThis is my post.",
					},
					{
						name: "status",
						type: "string",
						required: false,
						description: "Post status (draft, published)",
						example: "draft",
					},
				],
				requestBodyExample: {
					title: "My New Post",
					content: "# Hello\n\nThis is my post content.",
					status: "draft",
				},
				responses: [
					{
						statusCode: 201,
						description: "Post created successfully",
						body: {
							id: 1,
							title: "My New Post",
							content: "# Hello\n\nThis is my post content.",
							status: "draft",
							createdAt: "2024-01-15T10:30:00Z",
						},
					},
				],
			},
		],
	},
];

export function getEndpointById(id: string) {
	for (const group of apiGroups) {
		const endpoint = group.endpoints.find((e) => e.id === id);
		if (endpoint) return endpoint;
	}
	return null;
}

export function getAllEndpoints() {
	return apiGroups.flatMap((group) => group.endpoints);
}
