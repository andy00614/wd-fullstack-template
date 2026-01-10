---
name: create-module
description: Create a new feature module following project conventions. Use when adding new features like "posts", "comments", "notifications". Creates module structure, schemas, actions, and page.
---

# Create Module

Scaffold a new feature module following project architecture.

## Usage

When user says:
- "Create a posts module"
- "Add a new feature for X"
- "Scaffold module for Y"

## Module Structure

```
src/modules/[feature-name]/
├── actions/
│   └── index.ts        # Server Actions
├── components/
│   └── [component].tsx # Feature components
├── schemas.ts          # Zod validation schemas
├── types.ts            # TypeScript types
└── index.ts            # Public exports

src/app/[feature-name]/
└── page.tsx            # Route page
```

## Step-by-Step Process

### 1. Create Module Directory

```bash
mkdir -p src/modules/[feature]/actions
mkdir -p src/modules/[feature]/components
```

### 2. Create Types (types.ts)

```typescript
// src/modules/[feature]/types.ts
export interface [Feature] {
  id: string;
  // ... fields based on requirements
  created_at: string;
  updated_at: string;
}

export interface [Feature]Filters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
```

### 3. Create Schemas (schemas.ts)

```typescript
// src/modules/[feature]/schemas.ts
import { z } from 'zod';

export const create[Feature]Schema = z.object({
  // Define validation rules
  name: z.string().min(1, 'Name is required').max(100),
  // ... other fields
});

export const update[Feature]Schema = create[Feature]Schema.partial();

export const [feature]FiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'all']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type Create[Feature]Input = z.infer<typeof create[Feature]Schema>;
export type Update[Feature]Input = z.infer<typeof update[Feature]Schema>;
export type [Feature]Filters = z.infer<typeof [feature]FiltersSchema>;
```

### 4. Create Actions (actions/index.ts)

```typescript
// src/modules/[feature]/actions/index.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  create[Feature]Schema,
  update[Feature]Schema,
  [feature]FiltersSchema,
  type Create[Feature]Input,
  type [Feature]Filters,
} from '../schemas';

export async function create[Feature](input: Create[Feature]Input) {
  const validated = create[Feature]Schema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('[features]')
    .insert(validated)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/[features]');
  return data;
}

export async function list[Feature]s(filters: [Feature]Filters) {
  const { page, limit, search, status } = [feature]FiltersSchema.parse(filters);
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let query = supabase
    .from('[features]')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (status && status !== 'all') {
    query = query.eq('status', status);
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

export async function get[Feature](id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('[features]')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function update[Feature](id: string, input: unknown) {
  const validated = update[Feature]Schema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('[features]')
    .update(validated)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/[features]');
  revalidatePath(`/[features]/${id}`);
  return data;
}

export async function delete[Feature](id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('[features]')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/[features]');
  return { success: true };
}
```

### 5. Create Index Export (index.ts)

```typescript
// src/modules/[feature]/index.ts
export * from './types';
export * from './schemas';
export * from './actions';
```

### 6. Create Page (app/[feature]/page.tsx)

```typescript
// src/app/[feature]/page.tsx
import { list[Feature]s } from '@/modules/[feature]';
// Import components...

export default async function [Feature]sPage() {
  const { data: [feature]s } = await list[Feature]s({});

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">[Feature]s</h1>
      {/* Render list */}
    </main>
  );
}
```

## Database Table

If table doesn't exist, create migration:

```sql
-- drizzle/migrations/XXXX_create_[features].sql
CREATE TABLE [features] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  -- ... other fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE [features] ENABLE ROW LEVEL SECURITY;

-- Create policies as needed
```

## Checklist

- [ ] types.ts created with proper interfaces
- [ ] schemas.ts with Zod validation
- [ ] actions/index.ts with CRUD operations
- [ ] index.ts exporting public API
- [ ] Page created in app/ directory
- [ ] Database table/migration if needed
- [ ] Run `bun run typecheck` to verify
