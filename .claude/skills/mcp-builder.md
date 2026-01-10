---
name: mcp-builder
description: Guide for creating high-quality MCP (Model Context Protocol) servers. Use when building integrations with external APIs, services, or tools that Claude should be able to use.
---

# MCP Server Development

Build MCP servers that enable Claude to interact with external services.

## What is MCP?

Model Context Protocol (MCP) allows Claude to use external tools. An MCP server exposes tools that Claude can call during conversations.

## When to Build an MCP Server

Build an MCP server when you need Claude to:
- Interact with external APIs (GitHub, Slack, databases)
- Perform operations that require authentication
- Access real-time data
- Execute operations with side effects

## Development Phases

### Phase 1: Research and Planning

1. **Understand the API** you're integrating with
   - Read official documentation
   - Identify core operations needed
   - Note authentication requirements

2. **Design tools** that Claude will use
   - Each tool = one clear action
   - Tools should be composable
   - Error messages should guide Claude

### Phase 2: Implementation

#### Project Structure

```
my-mcp-server/
├── src/
│   ├── index.ts          # Entry point
│   ├── tools/            # Tool implementations
│   │   ├── posts.ts
│   │   └── users.ts
│   ├── client.ts         # API client
│   └── types.ts          # Type definitions
├── package.json
└── tsconfig.json
```

#### Basic Server Setup (TypeScript)

```typescript
// src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_posts',
      description: 'Retrieve posts from the API. Returns a list of posts with id, title, and content.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of posts to return (default: 10)',
          },
          status: {
            type: 'string',
            enum: ['draft', 'published', 'all'],
            description: 'Filter by post status',
          },
        },
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_posts':
      return await handleGetPosts(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

#### Tool Implementation

```typescript
// src/tools/posts.ts
import { z } from 'zod';
import { apiClient } from '../client';

const GetPostsSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  status: z.enum(['draft', 'published', 'all']).optional(),
});

export async function handleGetPosts(args: unknown) {
  const { limit, status } = GetPostsSchema.parse(args);

  try {
    const posts = await apiClient.getPosts({ limit, status });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(posts, null, 2),
        },
      ],
    };
  } catch (error) {
    // Actionable error messages
    if (error.status === 401) {
      return {
        content: [{
          type: 'text',
          text: 'Authentication failed. Please check your API key in the environment variables.',
        }],
        isError: true,
      };
    }
    throw error;
  }
}
```

### Phase 3: Tool Annotations

Mark tools with their behavior characteristics:

```typescript
{
  name: 'delete_post',
  description: 'Permanently delete a post by ID',
  inputSchema: { /* ... */ },
  annotations: {
    destructive: true,    // Deletes data
    idempotent: false,    // Can't undo
    readOnly: false,      // Modifies state
    openWorld: false,     // Operates on known resources
  },
}
```

### Phase 4: Testing

1. **Use MCP Inspector**
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

2. **Test each tool manually**
   - Valid inputs
   - Invalid inputs
   - Error conditions
   - Edge cases

3. **Write automated tests**
   ```typescript
   test('get_posts returns posts', async () => {
     const result = await handleGetPosts({ limit: 5 });
     expect(result.content[0].text).toContain('posts');
   });
   ```

## Design Principles

### Tool Naming

Use consistent, action-oriented prefixes:

```typescript
// GOOD: Consistent pattern
'list_posts'
'get_post'
'create_post'
'update_post'
'delete_post'

// BAD: Inconsistent
'fetchPosts'
'getOnePost'
'newPost'
'editPost'
'removePost'
```

### Error Messages

Guide Claude to the solution:

```typescript
// GOOD: Actionable
"Post not found. Use list_posts to see available post IDs."
"Rate limited. Wait 60 seconds before retrying."
"Invalid email format. Expected: user@domain.com"

// BAD: Vague
"Error occurred"
"Invalid input"
"Request failed"
```

### Response Format

Return both text and structured data:

```typescript
return {
  content: [
    {
      type: 'text',
      text: `Found ${posts.length} posts:\n${summary}`,
    },
    {
      type: 'resource',
      resource: {
        uri: 'posts://list',
        mimeType: 'application/json',
        text: JSON.stringify(posts),
      },
    },
  ],
};
```

## Adding to Project

```bash
# Add to .mcp.json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

## Resources

- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Example Servers](https://github.com/modelcontextprotocol/servers)
