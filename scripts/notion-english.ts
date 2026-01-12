#!/usr/bin/env bun
/**
 * Sync English learning records to Notion database
 * Usage: bun run scripts/notion-english.ts add "original" "corrected" "errorType" "category" "explanation" "fullExpression"
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID =
	process.env.NOTION_DATABASE_ID || "c0ad13f524254c2b9de55eb24e65e4ce";

interface EnglishRecord {
	original: string;
	corrected: string;
	errorType: "Grammar" | "Vocabulary" | "Spelling" | "Style";
	category: string;
	explanation: string;
	fullExpression?: string;
}

async function createRecord(record: EnglishRecord): Promise<void> {
	if (!NOTION_API_KEY) {
		console.error("Error: NOTION_API_KEY is not set");
		process.exit(1);
	}

	const response = await fetch("https://api.notion.com/v1/pages", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${NOTION_API_KEY}`,
			"Content-Type": "application/json",
			"Notion-Version": "2022-06-28",
		},
		body: JSON.stringify({
			parent: { database_id: NOTION_DATABASE_ID },
			properties: {
				OriginalTitle: {
					title: [{ text: { content: record.original } }],
				},
				CorrectedText: {
					rich_text: [{ text: { content: record.corrected } }],
				},
				"Error Type": {
					select: { name: record.errorType },
				},
				Category: {
					select: { name: record.category },
				},
				Explanation: {
					rich_text: [{ text: { content: record.explanation } }],
				},
				FullExpression: {
					rich_text: record.fullExpression
						? [{ text: { content: record.fullExpression } }]
						: [],
				},
				Times: {
					number: 1,
				},
				Mastered: {
					checkbox: false,
				},
				Date: {
					date: { start: new Date().toISOString().split("T")[0] },
				},
			},
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		console.error("Failed to create record:", error);
		process.exit(1);
	}

	const data = await response.json();
	console.log("Record created successfully:", data.url);
}

async function queryRecords(searchTerm?: string): Promise<void> {
	if (!NOTION_API_KEY) {
		console.error("Error: NOTION_API_KEY is not set");
		process.exit(1);
	}

	const body: Record<string, unknown> = {};
	if (searchTerm) {
		body.filter = {
			property: "OriginalTitle",
			title: { contains: searchTerm },
		};
	}

	const response = await fetch(
		`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${NOTION_API_KEY}`,
				"Content-Type": "application/json",
				"Notion-Version": "2022-06-28",
			},
			body: JSON.stringify(body),
		},
	);

	if (!response.ok) {
		const error = await response.json();
		console.error("Failed to query records:", error);
		process.exit(1);
	}

	const data = await response.json();
	console.log(`Found ${data.results.length} records:`);
	for (const page of data.results) {
		const title =
			page.properties.OriginalTitle?.title?.[0]?.text?.content || "Untitled";
		const corrected =
			page.properties.CorrectedText?.rich_text?.[0]?.text?.content || "";
		const errorType = page.properties["Error Type"]?.select?.name || "";
		console.log(`- "${title}" → "${corrected}" (${errorType})`);
	}
}

// CLI handling
const command = process.argv[2];

if (command === "add") {
	const [
		,
		,
		,
		original,
		corrected,
		errorType,
		category,
		explanation,
		fullExpression,
	] = process.argv;
	if (!original || !corrected || !errorType || !category || !explanation) {
		console.error(
			'Usage: bun run scripts/notion-english.ts add "original" "corrected" "errorType" "category" "explanation" ["fullExpression"]',
		);
		console.error("  errorType: Grammar | Vocabulary | Spelling | Style");
		console.error(
			"  category: Verb_missing | Article | Preposition | Capitalization | ...",
		);
		console.error(
			"  fullExpression: (optional) The complete original sentence",
		);
		process.exit(1);
	}
	await createRecord({
		original,
		corrected,
		errorType: errorType as EnglishRecord["errorType"],
		category,
		explanation,
		fullExpression,
	});
} else if (command === "query") {
	const searchTerm = process.argv[3];
	await queryRecords(searchTerm);
} else {
	console.log("English Learning Notion Sync");
	console.log("");
	console.log("Commands:");
	console.log(
		'  add "original" "corrected" "errorType" "category" "explanation" ["fullExpression"]',
	);
	console.log("  query [searchTerm]");
	console.log("");
	console.log("Examples:");
	console.log(
		'  bun run scripts/notion-english.ts add "english" "English" "Spelling" "Capitalization" "Language names must be capitalized" "I want to test my english skill"',
	);
	console.log("  bun run scripts/notion-english.ts query");
}
