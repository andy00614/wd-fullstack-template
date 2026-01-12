---
name: supabase-patterns
description: Common Supabase patterns for this project. Covers authentication, RLS policies, realtime subscriptions, and storage. Use when working with Supabase features.
---

# Supabase Patterns

Common patterns for Supabase in this Next.js project.

## Client Usage

### Server Components & Actions

```typescript
// ALWAYS use server client for RSC and Server Actions
import { createClient } from '@/lib/supabase/server';

export async function getPost(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
```

### Client Components

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';

export function PostActions({ postId }: { postId: string }) {
  const supabase = createClient();

  async function handleLike() {
    const { error } = await supabase
      .from('likes')
      .insert({ post_id: postId });

    if (error) console.error(error);
  }

  return <button onClick={handleLike}>Like</button>;
}
```

## Authentication

### Get Current User

```typescript
// Server-side
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  redirect('/login');
}
```

### Protected Server Action

```typescript
'use server';

export async function createPost(input: CreatePostInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
```

### Auth State in Client

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return user;
}
```

## Queries

### Basic CRUD

```typescript
// SELECT
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false });

// SELECT with relations
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(id, name, avatar),
    comments(id, content, created_at)
  `)
  .eq('id', postId)
  .single();

// INSERT
const { data, error } = await supabase
  .from('posts')
  .insert({ title, content, user_id })
  .select()
  .single();

// UPDATE
const { data, error } = await supabase
  .from('posts')
  .update({ title, content })
  .eq('id', postId)
  .select()
  .single();

// DELETE
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
```

### Pagination

```typescript
const page = 1;
const limit = 20;
const offset = (page - 1) * limit;

const { data, count } = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1)
  .order('created_at', { ascending: false });
```

### Search

```typescript
// Text search
const { data } = await supabase
  .from('posts')
  .select('*')
  .ilike('title', `%${search}%`);

// Full-text search (if configured)
const { data } = await supabase
  .from('posts')
  .select('*')
  .textSearch('fts', search);
```

### Filters

```typescript
// Multiple conditions
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('status', 'published')
  .gte('created_at', startDate)
  .lte('created_at', endDate)
  .in('category', ['tech', 'design']);

// OR conditions
const { data } = await supabase
  .from('posts')
  .select('*')
  .or('status.eq.published,status.eq.featured');
```

## Row Level Security (RLS)

### Common Policies

```sql
-- Anyone can read published posts
CREATE POLICY "Public read access"
  ON posts FOR SELECT
  USING (status = 'published');

-- Users can read their own drafts
CREATE POLICY "Users read own drafts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own posts
CREATE POLICY "Users insert own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own posts
CREATE POLICY "Users update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own posts
CREATE POLICY "Users delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

### Check Policies (use Supabase MCP)

```
"Show me the RLS policies on the posts table"
"Check if RLS is enabled on all tables"
```

## Realtime

### Subscribe to Changes

```typescript
'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimePosts(onUpdate: (post: Post) => void) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          onUpdate(payload.new as Post);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, onUpdate]);
}
```

## Storage

### Upload File

```typescript
const supabase = await createClient();

const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true,
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`);
```

## Error Handling

```typescript
const { data, error } = await supabase
  .from('posts')
  .insert(input)
  .select()
  .single();

if (error) {
  // Handle specific errors
  if (error.code === '23505') {
    return { error: 'Post already exists' };
  }
  if (error.code === '23503') {
    return { error: 'Referenced record not found' };
  }
  if (error.code === '42501') {
    return { error: 'Permission denied' };
  }
  // Generic error
  throw new Error(error.message);
}
```

## Debug with Supabase MCP

```
"Show me the last 10 logs from the Supabase API"
"Query the posts table to see recent entries"
"Check for any errors in the auth logs"
```
