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

## MCP Tools

项目配置了以下 MCP servers，优先使用这些工具：

| Tool | 用途 | 何时使用 |
|------|------|---------|
| **Supabase MCP** | 数据库操作、schema 管理、查看 logs | 需要查询/修改数据库时，优先于 `db:query` 脚本 |
| **Context7** | 获取最新库文档 | 使用 Next.js/React/Tailwind 等 API 时，加 "use context7" 获取最新文档 |
| **Puppeteer MCP** | 浏览器自动化、截图、交互测试 | 需要验证 UI、填表测试、复杂截图时 |

### 使用示例

```
# 查询数据库 - 用 Supabase MCP
"查看 posts 表的数据"

# 获取最新文档 - 用 Context7
"use context7, Next.js 15 的 useSearchParams 怎么用"

# UI 验证 - 用 Puppeteer MCP
"打开 localhost:3000/posts 并截图"
```

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

### 页面/UI 功能状态机

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKFLOW STATE MACHINE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [UNDERSTAND] ◄──────────────────────────────────┐          │
│    │ 确认需求、设计稿、边界                        │          │
│    ▼                                              │          │
│  [SCAFFOLD]                                       │          │
│    │ 创建模块结构                                 │          │
│    ▼                                              │          │
│  [MOCK_UI] ◄──────────────────────┐              │          │
│    │ 用 mock 数据完成 UI          │              │          │
│    ▼                              │              │          │
│  [REVIEW_UI]                      │              │          │
│    │ 截图/预览 → 等待用户确认      │              │          │
│    │ ❌ UI 不满意 ────────────────┘              │          │
│    ▼ ✅ 确认                                     │          │
│  [CONNECT_DATA]                                  │          │
│    │ 写 Server Action，接入真实数据              │          │
│    ▼                                             │          │
│  [REVIEW_DATA]                                   │          │
│    │ 验证数据流是否正确                           │          │
│    │ ❌ 数据结构问题 ────────────────────────────┘          │
│    ▼ ✅ 确认                                                │
│  [POLISH]                                                   │
│    │ loading/error 状态、边界处理                            │
│    ▼                                                        │
│  [VALIDATE]                                                 │
│    │ typecheck + lint + test                                │
│    ▼                                                        │
│  [DONE]                                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 各阶段详细说明

**[UNDERSTAND] 理解需求**
- 确认功能核心目的
- 询问是否有设计稿/参考页面（可用 Figma MCP 直接读取）
- 明确关键交互和边界情况
- **退出条件：** 用户确认需求理解正确

**[SCAFFOLD] 创建结构**
- 在 `src/app/` 创建页面文件
- 在 `src/modules/[feature]/` 创建模块结构
- **退出条件：** 文件结构创建完成

**[MOCK_UI] 实现 UI**
- 使用 Mock 数据填充 UI
- 如果不确定 API 用法，用 Context7 查最新文档
- **不要先写后端接口**
- **退出条件：** UI 可以在浏览器中预览

```typescript
// Mock 数据示例
const mockData = [
  { id: '1', title: 'Example', status: 'active' }
]
```

**[REVIEW_UI] UI 审查**
- 用 Puppeteer MCP 截图，或告知用户查看页面
- **等待用户反馈**
- ❌ 不满意 → 回到 [MOCK_UI]
- ✅ 确认 → 进入 [CONNECT_DATA]

**[CONNECT_DATA] 接入数据**
- 用 Supabase MCP 查看现有表结构和数据
- 在 `src/modules/[feature]/actions/` 创建 Server Action
- 使用 Zod 验证输入
- **退出条件：** Server Action 创建完成，数据可以读写

**[REVIEW_DATA] 数据验证**
- 用 Supabase MCP 验证数据是否正确写入
- 检查数据流是否符合预期
- ❌ 数据结构问题 → 回到 [UNDERSTAND] 重新理解需求
- ✅ 确认 → 进入 [POLISH]

**[POLISH] 完善细节**
- 添加 loading 状态
- 添加 error 处理
- 处理边界情况
- **退出条件：** 所有状态都有合理处理

**[VALIDATE] 质量验证**
- 运行 `bun run validate`（typecheck + lint + test）
- 关键业务逻辑补充 Vitest 单元测试
- 核心用户流程补充 Playwright E2E 测试
- **退出条件：** 所有检查通过

**[DONE] 完成**

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