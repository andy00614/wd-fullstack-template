# WD Fullstack Template

> **"让 AI 按你的规则写代码，而不是你适应 AI。"**

---

## 为什么选择这个模板？

传统 AI 编程的问题：AI 想怎么写就怎么写，代码风格混乱，需要大量 review。

**WD Fullstack Template 的解决方案：**

| 传统方式 | WD Template |
|---------|-------------|
| AI 自由发挥，结果不可控 | 状态机驱动，每步可追溯 |
| 手动查文档、执行命令 | MCP 工具自动化 |
| 代码规范靠人工 review | 工作流强制执行规范 |
| 出错后难以回溯 | 内置回溯机制 |

---

## 核心特性

### 状态机驱动开发

```
UNDERSTAND → SCAFFOLD → MOCK_UI → REVIEW_UI → CONNECT_DATA → POLISH → VALIDATE
```

AI 严格按阶段执行，每步等待确认，不越界。**Mock first** 让你先看到 UI 再接数据，减少返工。

### MCP 工具链集成

| 工具 | 能力 | 效果 |
|------|------|------|
| **Supabase MCP** | 数据库查询、schema 管理 | 直接操作数据库，零配置 |
| **Context7 MCP** | 实时文档查询 | 获取 Next.js/Tailwind 最新 API |
| **Puppeteer MCP** | 浏览器自动化 | 一键截图验证 UI |

### 代码规范强制执行

- Zod 验证写入工作流（Server Action 必须先定义 schema）
- 自动运行 `typecheck` + `lint`
- 文件位置规范化（actions、schemas、components）

---

## 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 15 + React 19 + TypeScript |
| **样式** | Tailwind CSS v4 + shadcn/ui |
| **后端** | Supabase (Database + Auth + Realtime) |
| **ORM** | Drizzle ORM + PostgreSQL |
| **状态** | Zustand (client) + React Query (server) |
| **表单** | React Hook Form + Zod |
| **质量** | Biome + Vitest + Playwright |

---

## 快速开始

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
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Database
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

### 5. 配置 MCP（推荐）

```bash
bun run mcp              # 查看所有 MCP 预设
bun run mcp supabase     # 获取 Supabase MCP 添加命令
```

重启 Claude Code，MCP servers 自动加载。

---

## 工作流验证结果

在实际测试中，模板达到了 **98% 的工作流遵循度**：

| 测试项 | 结果 |
|--------|------|
| 工作流遵循度 | 14/15 - 先理解需求、用 mock 数据、等待确认 |
| Supabase MCP | 10/10 - 直接查询表结构，无需手动命令 |
| Context7 MCP | 10/10 - 获取 Tailwind v4 最新文档 |
| Puppeteer MCP | 10/10 - 一键截图验证 UI |
| 代码规范 | 15/15 - Zod 验证、正确文件位置、自动检查 |

---

## 适用场景

- **团队协作**：统一 AI 行为，减少 code review 成本
- **快速原型**：状态机保证完整流程，不遗漏细节
- **质量保障**：强制规范 + 自动检查，减少低级错误
- **学习参考**：了解如何构建 AI-first 开发工作流

---

## 项目结构

```
src/
├── app/                    # Next.js App Router
├── components/ui/          # shadcn/ui 组件
├── modules/                # Feature-first 模块
│   └── [feature]/
│       ├── actions/        # Server Actions
│       ├── components/     # 功能组件
│       ├── schemas.ts      # Zod 验证
│       └── types.ts        # 类型定义
├── db/                     # Drizzle schema
└── lib/supabase/           # Supabase 客户端
```

---

## 常用命令

```bash
# 开发
bun dev                 # 启动开发服务器
bun run preview         # 构建并预览

# 质量检查
bun run check           # Lint + Format
bun run typecheck       # 类型检查
bun run validate        # 完整验证

# 数据库
bun run db:push         # 推送 schema
bun run db:studio       # 打开 Drizzle Studio

# MCP
bun run mcp             # 查看 MCP 预设
```

---

## 设计理念

1. **Less control, more tools** - 用工具扩展 AI 能力，而不是用规则限制
2. **固定工作流 + 回溯** - 顺序固定才可靠，出错能回退
3. **80% workflow, 20% agent** - 工作流承载主体，AI 补足剩余
4. **More tools = more power** - 工具越多，效率越高

---

## License

MIT

---

**Star this repo if you find it useful!**
