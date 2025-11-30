# 🚀 WD Fullstack Template

> **"Make AI code by your rules, not the other way around."**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase)](https://supabase.com/)

---

## 🤔 Why This Template?

**The Problem with Traditional AI Coding:**
AI writes whatever it wants, resulting in inconsistent code styles and requiring extensive code review.

**Our Solution:**

| ❌ Traditional Approach | ✅ WD Template |
|------------------------|----------------|
| AI runs wild, unpredictable results | State machine driven, every step traceable |
| Manually check docs & run commands | MCP tools automation |
| Code standards rely on manual review | Workflow enforces standards |
| Hard to backtrack after errors | Built-in rollback mechanism |

---

## ✨ Key Features

### 🔄 State Machine Driven Development

```
UNDERSTAND → SCAFFOLD → MOCK_UI → REVIEW_UI → CONNECT_DATA → POLISH → VALIDATE
```

AI strictly follows each phase, waits for confirmation at every step, and never overreaches. **Mock first** lets you see the UI before connecting data, reducing rework.

### 🔧 MCP Toolchain Integration

| Tool | Capability | Benefit |
|------|------------|---------|
| 🗄️ **Supabase MCP** | Database queries, schema management | Direct database operations, zero config |
| 📚 **Context7 MCP** | Real-time documentation lookup | Get latest Next.js/Tailwind APIs |
| 📸 **Puppeteer MCP** | Browser automation | One-click screenshot UI validation |

### ✅ Enforced Code Standards

- 🛡️ Zod validation built into workflow (Server Actions must define schema first)
- 🔍 Auto-run `typecheck` + `lint`
- 📁 Standardized file locations (actions, schemas, components)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 + React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Backend** | Supabase (Database + Auth + Realtime) |
| **ORM** | Drizzle ORM + PostgreSQL |
| **State** | Zustand (client) + React Query (server) |
| **Forms** | React Hook Form + Zod |
| **Quality** | Biome + Vitest + Playwright |

---

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
git clone https://github.com/andy00614/wd-fullstack-template.git
cd wd-fullstack-template
bun install
```

### 2️⃣ Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Database
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

### 3️⃣ Initialize Database

```bash
bun run db:push
```

### 4️⃣ Start Development

```bash
bun dev
```

### 5️⃣ Configure MCP (Recommended)

```bash
bun run mcp              # View all MCP presets
bun run mcp supabase     # Get Supabase MCP add command
```

Restart Claude Code, MCP servers will auto-load.

---

## 📊 Workflow Validation Results

In real-world testing, the template achieved **98% workflow compliance**:

| Test Item | Result |
|-----------|--------|
| 🎯 Workflow Compliance | 14/15 - Understands requirements first, uses mock data, waits for confirmation |
| 🗄️ Supabase MCP | 10/10 - Direct table structure queries, no manual commands |
| 📚 Context7 MCP | 10/10 - Fetched Tailwind v4 latest docs |
| 📸 Puppeteer MCP | 10/10 - One-click screenshot UI validation |
| ✅ Code Standards | 15/15 - Zod validation, correct file placement, auto checks |

---

## 🎯 Use Cases

- 👥 **Team Collaboration**: Unify AI behavior, reduce code review costs
- ⚡ **Rapid Prototyping**: State machine ensures complete flow, no details missed
- 🛡️ **Quality Assurance**: Enforced standards + auto checks, fewer bugs
- 📖 **Learning Reference**: Understand how to build AI-first development workflows

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/ui/          # shadcn/ui components
├── modules/                # Feature-first modules
│   └── [feature]/
│       ├── actions/        # Server Actions
│       ├── components/     # Feature components
│       ├── schemas.ts      # Zod validation
│       └── types.ts        # Type definitions
├── db/                     # Drizzle schema
└── lib/supabase/           # Supabase clients
```

---

## 📝 Common Commands

```bash
# Development
bun dev                 # Start dev server
bun run preview         # Build and preview

# Quality Checks
bun run check           # Lint + Format
bun run typecheck       # Type checking
bun run validate        # Full validation

# Database
bun run db:push         # Push schema
bun run db:studio       # Open Drizzle Studio

# MCP
bun run mcp             # View MCP presets
```

---

## 💡 Design Philosophy

1. 🔧 **Less control, more tools** - Extend AI capabilities with tools, not restrict with rules
2. 🔄 **Fixed workflow + rollback** - Fixed sequence is reliable, errors can be reverted
3. ⚖️ **80% workflow, 20% agent** - Workflow carries the main load, AI fills the gaps
4. 🚀 **More tools = more power** - More tools, higher efficiency

---

## 📄 License

MIT

---

<div align="center">

**⭐ Star this repo if you find it useful!**

[Report Bug](https://github.com/andy00614/wd-fullstack-template/issues) · [Request Feature](https://github.com/andy00614/wd-fullstack-template/issues)

</div>
