---
name: explaining-code
description: Explains code with visual diagrams, analogies, and step-by-step breakdowns. Use when teaching about a codebase, explaining how code works, or answering "how does this work?" questions.
---

# Explaining Code

Transform complex code into clear explanations using diagrams, analogies, and structured breakdowns.

## When to Use

- User asks "How does this work?"
- Onboarding someone to a codebase
- Explaining a bug or its fix
- Teaching a concept through code
- Code review explanations

## Explanation Framework

### 1. Start with the "Why"

Before diving into how code works, explain why it exists.

```
BAD: "This function iterates through the array and..."

GOOD: "This function solves the problem of finding duplicate
      entries in user data. Without it, users could submit
      the same form twice and create duplicate records."
```

### 2. Use Analogies

Connect code concepts to familiar real-world things.

```typescript
// This middleware is like a security guard at a building entrance.
// Before anyone (request) can enter the building (access the API),
// the guard checks their ID badge (JWT token).
export async function authMiddleware(request: Request) {
  const token = request.headers.get('Authorization');
  if (!token) {
    // No badge? Can't enter.
    return new Response('Unauthorized', { status: 401 });
  }
  // Badge valid? Let them through.
  return await verifyToken(token);
}
```

### 3. Visual Flow Diagrams

Use ASCII diagrams for data/control flow:

```
User submits form
       │
       ▼
┌─────────────────┐
│  Client-side    │
│  validation     │
└────────┬────────┘
         │ valid?
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
┌────────┐  Show
│ Server │  error
│ Action │
└────┬───┘
     │
     ▼
┌─────────────────┐
│  Server-side    │
│  validation     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
┌────────┐  Return
│  Save  │  error
│  to DB │
└────────┘
```

### 4. Step-by-Step Breakdown

Number each step with what happens:

```typescript
export async function createPost(input: CreatePostInput) {
  // STEP 1: Validate input against schema
  // - Checks title length (1-100 chars)
  // - Checks content is not empty
  // - If invalid, throws ZodError with field-specific messages
  const validated = createPostSchema.parse(input);

  // STEP 2: Create database client
  // - Uses server-side Supabase client (has service role)
  // - Automatically handles auth cookies
  const supabase = await createClient();

  // STEP 3: Insert into database
  // - .insert() creates new row
  // - .select() returns the created row
  // - .single() ensures we get one object, not array
  const { data, error } = await supabase
    .from('posts')
    .insert(validated)
    .select()
    .single();

  // STEP 4: Handle database errors
  // - Could be constraint violation, connection issue, etc.
  if (error) throw new Error(error.message);

  // STEP 5: Invalidate cache
  // - Next.js caches /posts page
  // - Without this, new post won't appear until cache expires
  revalidatePath('/posts');

  // STEP 6: Return created post
  return data;
}
```

### 5. Highlight Key Patterns

Call out important patterns explicitly:

```typescript
// PATTERN: Early Return / Guard Clause
// Instead of deeply nested if-else, we return early for edge cases.
// This keeps the "happy path" un-indented and easy to follow.

function processUser(user: User | null) {
  // Guard: Handle null case
  if (!user) {
    return { error: 'User not found' };
  }

  // Guard: Handle inactive user
  if (!user.isActive) {
    return { error: 'User is deactivated' };
  }

  // Happy path: Process active user
  return { data: transformUser(user) };
}
```

### 6. Before/After Comparisons

Show why the current approach is better:

```typescript
// BEFORE: Callback hell
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // Finally do something
    });
  });
});

// AFTER: Async/await
const user = await getUser(id);
const posts = await getPosts(user.id);
const comments = await getComments(posts[0].id);
// Clean and readable
```

## Diagram Types

### Sequence Diagram (for API flows)

```
Client          Server          Database
  │                │                │
  │──POST /posts──▶│                │
  │                │──INSERT───────▶│
  │                │◀──success──────│
  │◀──201 Created──│                │
  │                │                │
```

### Component Tree (for React)

```
App
 ├── Layout
 │    ├── Header
 │    │    └── NavMenu
 │    └── Sidebar
 └── PostsPage
      ├── PostList
      │    └── PostCard (×n)
      └── CreatePostButton
```

### State Machine (for complex state)

```
       ┌─────────────────────────────────┐
       │                                 │
       ▼                                 │
    ┌──────┐  submit   ┌─────────┐      │
───▶│ IDLE │──────────▶│ LOADING │      │
    └──────┘           └────┬────┘      │
       ▲                    │           │
       │                ┌───┴───┐       │
       │           success     error    │
       │                │       │       │
       │                ▼       ▼       │
       │           ┌───────┐ ┌───────┐  │
       └───reset───│SUCCESS│ │ ERROR │──┘
                   └───────┘ └───────┘
```

## Response Structure

1. **One-sentence summary** - What does this code do?
2. **Why it exists** - What problem does it solve?
3. **Step-by-step breakdown** - How does it work?
4. **Visual diagram** - Flow or structure
5. **Key patterns** - What techniques are used?
6. **Edge cases** - What could go wrong?

## Tips

- Use code comments inline for step-by-step explanations
- Keep diagrams simple - max 10-15 elements
- Use familiar analogies (guard, pipeline, factory)
- Highlight the "interesting" parts, skip boilerplate
- Link to related files when relevant (`see src/lib/auth.ts:42`)
