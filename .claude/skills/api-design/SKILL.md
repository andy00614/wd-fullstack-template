---
name: api-design
description: REST API design best practices for Next.js Server Actions and API routes. Covers resource naming, HTTP methods, error handling (RFC 7807), pagination, and validation patterns.
---

# API Design

Best practices for designing REST APIs and Server Actions in Next.js + Supabase.

## Resource Naming

Use nouns, not verbs. Resources are things, not actions.

```typescript
// GOOD: Resource-based
GET    /api/posts          // List posts
GET    /api/posts/123      // Get post
POST   /api/posts          // Create post
PATCH  /api/posts/123      // Update post
DELETE /api/posts/123      // Delete post

// BAD: Verb-based
GET    /api/getPosts
POST   /api/createPost
POST   /api/deletePost
```

For Server Actions, use action verbs but keep resource focus:

```typescript
// Server Actions (actions/index.ts)
export async function createPost(data: CreatePostInput) { }
export async function updatePost(id: string, data: UpdatePostInput) { }
export async function deletePost(id: string) { }
export async function listPosts(filters: PostFilters) { }
```

## HTTP Status Codes

| Code | When to Use |
|------|-------------|
| 200 | Success with body |
| 201 | Created new resource |
| 204 | Success, no content (delete) |
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable entity |
| 500 | Server error |

## Error Handling (RFC 7807)

Use Problem Details format for consistent errors:

```typescript
// types.ts
interface ProblemDetails {
  type: string;        // URI identifying error type
  title: string;       // Human-readable summary
  status: number;      // HTTP status code
  detail?: string;     // Human-readable explanation
  instance?: string;   // URI of specific occurrence
  errors?: Record<string, string[]>; // Field-level errors
}

// Example error response
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "The request body contains invalid fields",
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Must be at least 8 characters"]
  }
}
```

### Error Helper

```typescript
// lib/errors.ts
export function createError(
  status: number,
  title: string,
  detail?: string,
  errors?: Record<string, string[]>
): ProblemDetails {
  return {
    type: `https://api.example.com/errors/${status}`,
    title,
    status,
    detail,
    errors,
  };
}

// Usage in Server Action
export async function createPost(input: unknown) {
  const result = createPostSchema.safeParse(input);

  if (!result.success) {
    return {
      error: createError(
        400,
        'Validation Error',
        'Invalid input data',
        formatZodErrors(result.error)
      )
    };
  }

  // ... create post
}
```

## Validation with Zod

Always validate at boundaries:

```typescript
// schemas.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  content: z.string()
    .min(1, 'Content is required'),
  status: z.enum(['draft', 'published']).default('draft'),
  tags: z.array(z.string()).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const postFiltersSchema = z.object({
  status: z.enum(['draft', 'published', 'all']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostFilters = z.infer<typeof postFiltersSchema>;
```

## Pagination

### Offset-based (Simple)

```typescript
// Response format
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Server Action
export async function listPosts(filters: PostFilters) {
  const { page, limit, status, search } = postFiltersSchema.parse(filters);
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, count, error } = await query
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return {
    data: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}
```

### Cursor-based (For infinite scroll)

```typescript
interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export async function listPostsCursor(cursor?: string, limit = 20) {
  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit + 1); // Fetch one extra to check hasMore

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const hasMore = (data?.length ?? 0) > limit;
  const posts = hasMore ? data?.slice(0, -1) : data;

  return {
    data: posts ?? [],
    nextCursor: posts?.at(-1)?.created_at ?? null,
    hasMore,
  };
}
```

## Server Action Patterns

### Standard CRUD

```typescript
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createPostSchema, updatePostSchema } from './schemas';

export async function createPost(input: z.infer<typeof createPostSchema>) {
  const validated = createPostSchema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .insert(validated)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { error: createError(409, 'Conflict', 'Post already exists') };
    }
    throw new Error(error.message);
  }

  revalidatePath('/posts');
  return { data };
}

export async function updatePost(id: string, input: unknown) {
  const validated = updatePostSchema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .update(validated)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) {
    return { error: createError(404, 'Not Found', 'Post not found') };
  }

  revalidatePath('/posts');
  revalidatePath(`/posts/${id}`);
  return { data };
}

export async function deletePost(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/posts');
  return { success: true };
}
```

## Security Checklist

- [ ] Validate all inputs with Zod
- [ ] Check authentication before sensitive operations
- [ ] Verify authorization (user owns resource)
- [ ] Use RLS policies in Supabase
- [ ] Never expose internal error details
- [ ] Rate limit write operations
- [ ] Sanitize search inputs
