---
name: db-migration
description: Create and manage database migrations with Drizzle ORM and Supabase. Use when modifying database schema, adding tables, columns, or indexes.
---

# Database Migration

Create and apply database schema changes safely.

## Quick Commands

```bash
# Generate migration from schema changes
bun run db:generate

# Apply pending migrations
bun run db:migrate

# Push schema directly (dev only)
bun run db:push

# Open Drizzle Studio
bun run db:studio

# Query database
bun run db:query tables
bun run db:query describe posts
```

## Workflow

### Option 1: Schema-First (Recommended)

1. **Modify schema** in `src/db/schema.ts`
2. **Generate migration** with `bun run db:generate`
3. **Review** generated SQL in `drizzle/` folder
4. **Apply** with `bun run db:migrate`

### Option 2: Direct Push (Development)

```bash
# Skip migration files, push directly
bun run db:push
```

Use only in development when iterating quickly.

### Option 3: Manual Migration via Supabase MCP

For complex migrations, use Supabase MCP:

```
"Apply migration: create posts table with id, title, content, user_id"
```

## Schema Definition

```typescript
// src/db/schema.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from 'drizzle-orm/pg-core';

// Basic table
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  status: varchar('status', { length: 20 }).default('draft'),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// With indexes
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  postIdIdx: index('comments_post_id_idx').on(table.postId),
}));

// With composite unique
export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').notNull(),
  role: varchar('role', { length: 50 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.role] }),
}));
```

## Common Migrations

### Add Column

```typescript
// In schema.ts, add field:
export const posts = pgTable('posts', {
  // ... existing fields
  viewCount: integer('view_count').default(0), // NEW
});

// Then generate:
// bun run db:generate
```

### Add Index

```typescript
export const posts = pgTable('posts', {
  // ... fields
}, (table) => ({
  statusIdx: index('posts_status_idx').on(table.status),
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
}));
```

### Add Foreign Key

```typescript
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  // ...
});
```

### Add RLS Policy (via Supabase MCP)

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can read all posts
CREATE POLICY "Anyone can read posts"
  ON posts FOR SELECT
  USING (true);

-- Users can only modify their own posts
CREATE POLICY "Users can modify own posts"
  ON posts FOR ALL
  USING (auth.uid() = user_id);
```

## Migration via Supabase MCP

For direct SQL or when Drizzle isn't sufficient:

```
"Apply migration 'add_posts_view_count':
ALTER TABLE posts ADD COLUMN view_count INTEGER DEFAULT 0;"
```

```
"Apply migration 'add_posts_index':
CREATE INDEX posts_status_idx ON posts(status);"
```

## Verify Migration

```bash
# Check current tables
bun run db:query tables

# Describe table structure
bun run db:query describe posts

# Count rows
bun run db:query count posts

# Custom query
bun run db:query raw "SELECT * FROM posts LIMIT 5"
```

Or use Supabase MCP:
```
"Show me the structure of the posts table"
"List all tables in the database"
```

## Rollback Strategy

Drizzle doesn't auto-generate rollbacks. For critical changes:

1. **Before applying**, save current schema state
2. **Create manual rollback** SQL if needed
3. **Test in development** first
4. **Backup production** before applying

```sql
-- Manual rollback example
-- rollback_add_view_count.sql
ALTER TABLE posts DROP COLUMN IF EXISTS view_count;
```

## Checklist

Before applying migration:

- [ ] Schema changes are in `src/db/schema.ts`
- [ ] Generated migration reviewed
- [ ] Tested locally with `db:push`
- [ ] Indexes added for frequently queried columns
- [ ] Foreign keys have appropriate ON DELETE behavior
- [ ] RLS policies updated if needed
- [ ] Rollback plan documented for critical changes

After applying:

- [ ] Verify with `db:query describe [table]`
- [ ] Update TypeScript types if needed
- [ ] Update affected Server Actions
- [ ] Run `bun run typecheck`
