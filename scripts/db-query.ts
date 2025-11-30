import "dotenv/config";
import { getTableColumns, getTableName, is, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";

const client = postgres(process.env.DIRECT_URL!);
const db = drizzle(client, { schema });

// Extract valid table objects from schema
function getValidTables(): Map<string, PgTable> {
	const tables = new Map<string, PgTable>();
	for (const [key, value] of Object.entries(schema)) {
		if (is(value, PgTable)) {
			tables.set(key, value);
		}
	}
	return tables;
}

function getTableByName(name: string): { key: string; table: PgTable } | null {
	const tables = getValidTables();
	// Try exact match first (schema export name)
	if (tables.has(name)) {
		return { key: name, table: tables.get(name)! };
	}
	// Try to find by SQL table name
	for (const [key, table] of tables) {
		if (getTableName(table) === name) {
			return { key, table };
		}
	}
	return null;
}

// Parse flags from args
function parseArgs(args: string[]): {
	command: string;
	params: string[];
	json: boolean;
} {
	const json = args.includes("--json");
	const filtered = args.filter((a) => !a.startsWith("--"));
	return { command: filtered[0] || "", params: filtered.slice(1), json };
}

function output(data: unknown, json: boolean) {
	if (json) {
		console.log(JSON.stringify(data));
	} else {
		console.log(
			typeof data === "string" ? data : JSON.stringify(data, null, 2),
		);
	}
}

async function query() {
	const { command, params, json } = parseArgs(process.argv.slice(2));

	if (!command) {
		console.log("Usage:");
		console.log("  bun run db:query tables                # List all tables");
		console.log(
			"  bun run db:query describe <table>      # Show table structure",
		);
		console.log(
			"  bun run db:query select <table> [n]    # Select n rows (default 10)",
		);
		console.log("  bun run db:query count <table>         # Count rows");
		console.log("  bun run db:query raw '<SQL>'           # Raw SQL query");
		console.log("");
		console.log("Flags:");
		console.log(
			"  --json                                 # Output as JSON (for parsing)",
		);
		process.exit(0);
	}

	try {
		switch (command) {
			case "tables": {
				const tables = getValidTables();
				const tableList = Array.from(tables.entries()).map(([key, table]) => ({
					name: key,
					sqlName: getTableName(table),
				}));
				if (json) {
					output(tableList, true);
				} else {
					console.log("Available tables:");
					for (const t of tableList) {
						console.log(`  ${t.name} -> "${t.sqlName}"`);
					}
				}
				break;
			}

			case "describe": {
				const tableName = params[0];
				if (!tableName) {
					console.error("Please specify a table name");
					process.exit(1);
				}
				const found = getTableByName(tableName);
				if (!found) {
					console.error(`Table "${tableName}" not found`);
					console.error(
						"Available:",
						Array.from(getValidTables().keys()).join(", "),
					);
					process.exit(1);
				}
				const columns = getTableColumns(found.table);
				const columnInfo = Object.entries(columns).map(([name, col]) => ({
					name,
					sqlName: col.name,
					type: col.dataType,
					notNull: col.notNull,
					hasDefault: col.hasDefault,
				}));
				if (json) {
					output(
						{
							table: found.key,
							sqlName: getTableName(found.table),
							columns: columnInfo,
						},
						true,
					);
				} else {
					console.log(`Table: ${found.key} ("${getTableName(found.table)}")`);
					console.log("Columns:");
					for (const c of columnInfo) {
						const flags = [
							c.notNull ? "NOT NULL" : "NULL",
							c.hasDefault ? "DEFAULT" : "",
						]
							.filter(Boolean)
							.join(" ");
						console.log(`  ${c.name} (${c.type}) ${flags}`);
					}
				}
				break;
			}

			case "select": {
				const tableName = params[0];
				if (!tableName) {
					console.error("Please specify a table name");
					process.exit(1);
				}
				const found = getTableByName(tableName);
				if (!found) {
					console.error(`Table "${tableName}" not found`);
					console.error(
						"Available:",
						Array.from(getValidTables().keys()).join(", "),
					);
					process.exit(1);
				}
				const limit = Number.parseInt(params[1] || "10", 10);
				const data = await db.select().from(found.table).limit(limit);
				output(data, json);
				break;
			}

			case "count": {
				const tableName = params[0];
				if (!tableName) {
					console.error("Please specify a table name");
					process.exit(1);
				}
				const found = getTableByName(tableName);
				if (!found) {
					console.error(`Table "${tableName}" not found`);
					console.error(
						"Available:",
						Array.from(getValidTables().keys()).join(", "),
					);
					process.exit(1);
				}
				// Use drizzle's sql template for safe query
				const sqlTableName = getTableName(found.table);
				const result = await db.execute(
					sql.raw(`SELECT COUNT(*) as count FROM "${sqlTableName}"`),
				);
				const count = result[0]?.count ?? 0;
				if (json) {
					output({ table: found.key, count: Number(count) }, true);
				} else {
					console.log(`${found.key}: ${count} rows`);
				}
				break;
			}

			case "raw": {
				const sqlQuery = params[0];
				if (!sqlQuery) {
					console.error("Please provide a SQL query");
					process.exit(1);
				}
				const result = await client.unsafe(sqlQuery);
				output(result, json);
				break;
			}

			default:
				console.error(`Unknown command: ${command}`);
				process.exit(1);
		}
	} finally {
		await client.end();
	}
}

query().catch((err) => {
	console.error("Query failed:", err.message);
	process.exit(1);
});
