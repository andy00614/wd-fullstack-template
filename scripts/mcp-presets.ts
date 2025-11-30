#!/usr/bin/env bun

/**
 * MCP Presets - Generate claude mcp add commands
 *
 * Usage:
 *   bun run scripts/mcp-presets.ts              # List all presets with commands
 *   bun run scripts/mcp-presets.ts <name>       # Show command for specific preset
 */

interface McpPreset {
	transport: "http" | "stdio";
	url?: string;
	command?: string[];
	headers?: Record<string, string>;
	env?: Record<string, string>;
	description: string;
}

const PRESETS: Record<string, McpPreset> = {
	supabase: {
		transport: "http",
		url: "https://mcp.supabase.com/mcp",
		headers: {
			"X-Supabase-Key": "<YOUR_SUPABASE_KEY>",
		},
		description: "Supabase database operations and schema management",
	},
	context7: {
		transport: "http",
		url: "https://mcp.context7.com/mcp",
		headers: {
			CONTEXT7_API_KEY: "<YOUR_CONTEXT7_API_KEY>",
		},
		description: "Get latest library documentation",
	},
	puppeteer: {
		transport: "stdio",
		command: ["npx", "-y", "@modelcontextprotocol/server-puppeteer"],
		description: "Browser automation and screenshots",
	},
	filesystem: {
		transport: "stdio",
		command: ["npx", "-y", "@modelcontextprotocol/server-filesystem", "."],
		description: "File system operations",
	},
	github: {
		transport: "stdio",
		command: ["npx", "-y", "@modelcontextprotocol/server-github"],
		env: {
			GITHUB_TOKEN: "<YOUR_GITHUB_TOKEN>",
		},
		description: "GitHub API operations",
	},
	postgres: {
		transport: "stdio",
		command: ["npx", "-y", "@modelcontextprotocol/server-postgres"],
		env: {
			DATABASE_URL: "<YOUR_DATABASE_URL>",
		},
		description: "Direct PostgreSQL access",
	},
	fetch: {
		transport: "stdio",
		command: ["npx", "-y", "@modelcontextprotocol/server-fetch"],
		description: "HTTP fetch operations",
	},
	memory: {
		transport: "stdio",
		command: ["npx", "-y", "@modelcontextprotocol/server-memory"],
		description: "Persistent memory/knowledge graph",
	},
	slack: {
		transport: "stdio",
		command: ["npx", "-y", "@anthropics/mcp-server-slack"],
		env: {
			SLACK_BOT_TOKEN: "<YOUR_SLACK_BOT_TOKEN>",
		},
		description: "Slack integration",
	},
	sqlite: {
		transport: "stdio",
		command: ["npx", "-y", "@anthropics/mcp-server-sqlite", "./data.db"],
		description: "SQLite database access",
	},
};

function generateCommand(name: string, preset: McpPreset): string {
	const parts = ["claude mcp add", `--transport ${preset.transport}`, name];

	if (preset.transport === "http" && preset.url) {
		parts.push(preset.url);

		if (preset.headers) {
			for (const [key, value] of Object.entries(preset.headers)) {
				parts.push(`--header "${key}: ${value}"`);
			}
		}
	}

	if (preset.transport === "stdio" && preset.command) {
		if (preset.env) {
			for (const [key, value] of Object.entries(preset.env)) {
				parts.push(`-e ${key}=${value}`);
			}
		}
		parts.push("--", ...preset.command);
	}

	return parts.join(" ");
}

function listAll(): void {
	console.log("\n📦 MCP Presets - Copy & Run Commands\n");
	console.log("=".repeat(60));

	for (const [name, preset] of Object.entries(PRESETS)) {
		console.log(`\n## ${name}`);
		console.log(`   ${preset.description}`);
		console.log("");
		console.log(`   ${generateCommand(name, preset)}`);
	}

	console.log("\n" + "=".repeat(60));
	console.log("\nUsage:");
	console.log("  bun run mcp              # List all presets");
	console.log("  bun run mcp <name>       # Show specific preset");
	console.log("\nManage:");
	console.log("  claude mcp list          # View installed MCPs");
	console.log("  claude mcp remove <name> # Remove an MCP\n");
}

function showOne(name: string): void {
	const preset = PRESETS[name];
	if (!preset) {
		console.error(`Unknown preset: ${name}`);
		console.log(`Available: ${Object.keys(PRESETS).join(", ")}`);
		process.exit(1);
	}

	console.log(`\n# ${name} - ${preset.description}\n`);
	console.log(generateCommand(name, preset));
	console.log("");

	if (preset.headers || preset.env) {
		console.log("⚠️  Replace placeholders with your actual values:");
		if (preset.headers) {
			for (const key of Object.keys(preset.headers)) {
				console.log(`   - ${key}`);
			}
		}
		if (preset.env) {
			for (const key of Object.keys(preset.env)) {
				console.log(`   - ${key}`);
			}
		}
		console.log("");
	}
}

// Main
const [, , arg] = process.argv;

if (arg) {
	showOne(arg);
} else {
	listAll();
}
