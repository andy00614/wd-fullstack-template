# WD Fullstack Template

AI-first 全栈开发模板，为 vibe coding 优化。

## 设计理念

1. **Less control, more tools** - 用工具扩展 AI 能力，而不是用规则限制
2. **More rigid rules = lower ceiling** - 规则越死，能力上限越低
3. **固定工作流 + 回溯** - 顺序固定才可靠，出错能回退
4. **80% workflow, 20% agent** - 工作流承载主体，AI 补足剩余
5. **More tools = more power** - 工具越多，效率越高

## Tech Stack

Next.js 15 | React 19 | TypeScript | Tailwind v4 | shadcn/ui | Supabase | Drizzle | Zod

## 工作流

```
UNDERSTAND → SCAFFOLD → MOCK_UI → REVIEW_UI → CONNECT_DATA → REVIEW_DATA → POLISH → VALIDATE → DONE
                           ↑          │              ↑              │
                           └──────────┘              └──────────────┘
                           UI 不满意                  数据结构问题
```

## MCP Tools

| Tool | 用途 |
|------|------|
| Supabase MCP | 数据库操作、schema 管理 |
| Context7 | 获取最新库文档 |
| Puppeteer MCP | 浏览器自动化、截图 |

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/andy00614/wd-fullstack-template.git
cd wd-fullstack-template
bun install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```bash
# Supabase（从 supabase.com 获取）
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Database（Supabase 连接字符串）
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

### 3. 初始化数据库

```bash
bun run db:push
```

### 4. 启动开发

```bash
bun dev
```

### 5. 配置 MCP（可选）

重启 Claude Code，MCP servers 会自动加载（`.mcp.json` 已配置）。

---

## Features

- [x] Less control, more tools 架构
- [x] 固定工作流 + 回溯机制
- [x] MCP tools（Supabase, Context7, Puppeteer）
- [x] Feature-first 模块结构
- [x] Mock first 开发流程
- [x] Biome lint/format
- [x] TypeScript 严格模式

## TODO

- [ ] Figma MCP 集成
- [ ] E2E 测试覆盖
- [ ] 部署脚本（Vercel）
- [ ] 更多 scripts 工具
