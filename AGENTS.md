# Project: WD Fullstack Template

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (Database + Auth + Realtime)
- Drizzle ORM + PostgreSQL
- Zustand (client state) + React Query (server state)
- React Hook Form + Zod (forms & validation)
- Biome (lint + format)
- Vitest (unit tests) + Playwright (E2E)
- bun as package manager

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── [route]/
│       └── page.tsx
├── components/
│   └── ui/                 # Base UI components (shadcn/ui)
├── modules/                # Feature-first modules
│   └── [feature]/
│       ├── actions/        # Server Actions
│       │   └── index.ts
│       ├── components/     # Feature-specific components
│       ├── schemas.ts      # Zod validation schemas
│       ├── types.ts        # Feature-specific types
│       └── index.ts        # Public exports
├── db/
│   ├── schema.ts           # Drizzle schema definitions
│   └── index.ts            # DB client export
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── middleware.ts   # Auth middleware
│   └── utils.ts            # Shared utilities
└── styles/
    └── globals.css         # Global styles + Tailwind
```

### 新功能模块创建规范

```bash
src/modules/[feature-name]/
├── actions/index.ts        # Server Actions
├── components/             # UI components
├── schemas.ts              # Zod schemas
└── index.ts                # Public API
```

---

## Development Workflow

### 页面/UI 功能需求，严格遵循以下步骤：

**Step 1: 理解需求**
- 确认功能核心目的
- 询问是否有设计稿/参考页面
- 明确关键交互和边界情况

**Step 2: 先写页面 + Mock 数据**
- 在 `src/app/` 创建页面
- 使用 Mock 数据填充 UI
- **不要先写后端接口**

```typescript
// ✅ 正确：先用 Mock
const mockData = [
  { id: '1', title: 'Example', status: 'active' }
]

export default function ExamplePage() {
  const data = mockData // 后面替换为真实数据
  return <DataList data={data} />
}
```

**Step 3: 等待用户确认**
- 完成页面后，告知用户："页面已完成，请查看 http://localhost:3000/xxx 确认 UI 是否符合预期"
- **等待用户反馈再继续下一步**

**Step 4: 用户确认后，写 Server Action**
- 在 `src/modules/[feature]/actions/` 创建
- 从页面组件推导出需要的数据结构
- 使用 Zod 验证输入

```typescript
// src/modules/example/actions/index.ts
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const InputSchema = z.object({
  title: z.string().min(1),
})

export async function createExample(input: z.infer<typeof InputSchema>) {
  const validated = InputSchema.parse(input)
  const supabase = await createClient()
  // ... 数据库操作
}
```

**Step 5: 替换 Mock 为真实数据**
- 更新页面组件使用真实接口
- 添加 loading 状态
- 添加 error 处理

**Step 6: 稳定后补充测试**
- 关键业务逻辑 → Vitest 单元测试
- 核心用户流程 → Playwright E2E 测试

---

### 纯逻辑/后端功能，可以用 TDD：

1. 先写测试定义期望行为
2. 实现代码让测试通过
3. 重构优化

---

### 例外情况（先写后端）：

- 第三方 API 集成（如 Claude API、支付 API）
- 复杂业务逻辑需要先理清数据流
- 用户明确提供了 API 规范文档

---

## Code Conventions

### General

- Only create an abstraction if it's actually needed
- Prefer clear function/variable names over inline comments
- Avoid helper functions when a simple inline expression would suffice
- Use `knip` to remove unused code if making large changes
- The `gh` CLI is installed, use it for GitHub operations
- Don't use emojis in code or comments

### React

- Avoid massive JSX blocks, compose smaller components
- Colocate code that changes together
- Avoid `useEffect` unless absolutely needed
- Use Zustand for client state, React Query for server state
- Prefer Server Components, use 'use client' only when necessary

### Tailwind

- Mostly use built-in values, occasionally allow dynamic values, rarely globals
- Use v4 syntax + global CSS file format
- Use shadcn/ui components as base

### Next.js

- Prefer fetching data in RSC (page can still be static)
- Use next/font + next/script when applicable
- next/image above the fold: use `priority` sparingly
- Be mindful of serialized prop size for RSC → client components
- Use Server Actions for mutations, not API routes

### TypeScript

- Don't unnecessarily add `try`/`catch`, let errors bubble
- Don't cast to `any`, use proper types or `unknown`
- Use Zod for runtime validation at boundaries
- Export types from module's `index.ts`

### Supabase

- Use `lib/supabase/server.ts` for Server Components and Server Actions
- Use `lib/supabase/client.ts` for Client Components
- Leverage RLS (Row Level Security) for data access control
- Always check `error` in Supabase responses

### Drizzle

- Schema definitions in `src/db/schema.ts`
- Use `db.query.*` for simple queries with relations
- Use `db.select()` for complex joins and aggregations
- Run `bun run db:push` after schema changes

---

## Commands

```bash
# Development
bun dev                 # Start dev server with turbo
bun run preview         # Build + start production server

# Code Quality (run after changes)
bun run check           # Biome lint/format check
bun run check:write     # Auto-fix lint/format issues
bun run typecheck       # TypeScript type check
bun run validate        # Full validation (typecheck + check + test)

# Testing
bun test                # Vitest watch mode
bun run test:run        # Vitest single run
bun run test:coverage   # Run with coverage report
bun run e2e             # Playwright E2E tests
bun run e2e:ui          # Playwright with UI mode

# Database
bun run db:generate     # Generate migration files
bun run db:migrate      # Run pending migrations
bun run db:push         # Push schema directly to DB
bun run db:studio       # Open Drizzle Studio GUI
bun run db:query        # Query database (tables/describe/select/count/raw)

# Utilities
bun run screenshot      # Capture webpage screenshot with Playwright

# Analysis
bun run knip            # Find unused code/exports/dependencies
bun run analyze         # Analyze bundle size
```

---

## Quality Checklist

### After making code changes:

```bash
bun run check           # Lint/format
bun run typecheck       # Type errors
bun run test:run        # Unit tests
```

### Before commit/PR:

```bash
bun run validate        # All quality checks
bun run e2e             # E2E tests (if UI changed)
bun run knip            # Check for unused code
```

**Never use `--no-verify` when committing.**

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `app/dashboard/page.tsx` |
| Layouts | `layout.tsx` | `app/dashboard/layout.tsx` |
| Components | `kebab-case.tsx` | `user-profile-card.tsx` |
| Server Actions | `index.ts` in actions folder | `modules/auth/actions/index.ts` |
| Schemas | `schemas.ts` | `modules/auth/schemas.ts` |
| Tests | `*.test.ts` | `utils.test.ts`, `schemas.test.ts` |
| Types | `types.ts` | `modules/auth/types.ts` |

---

## Communication Style

- 完成每个步骤后，简要告知进度
- 遇到需要用户决策的地方，**明确提问并等待回复**
- 不要一次性做太多，分步确认
- 代码变更后主动运行 `bun run check` 和 `bun run typecheck`
- 如果测试失败，先修复再继续
- 使用中文沟通，代码和注释用英文

---

## Common Patterns

### Server Action with Validation

```typescript
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const CreatePostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
})

export async function createPost(input: z.infer<typeof CreatePostSchema>) {
  const validated = CreatePostSchema.parse(input)
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .insert(validated)
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/posts')
  return data
}
```

### Page with Data Fetching (RSC)

```typescript
import { createClient } from '@/lib/supabase/server'
import { PostList } from '@/modules/posts/components/post-list'

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>
      <PostList posts={posts ?? []} />
    </main>
  )
}
```

### Client Component with Form

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createPost } from '../actions'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
})

export function PostForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createPost(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('title')} placeholder="Post title" />
      <Button type="submit">Create</Button>
    </form>
  )
}
```