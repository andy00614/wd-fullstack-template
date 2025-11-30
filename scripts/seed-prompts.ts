import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { prompts } from "../src/db/schema";

const client = postgres(process.env.DIRECT_URL!);
const db = drizzle(client);

const categories = ["Coding", "Writing", "Translation", "Analysis", "Creative"];

const authors = [
	"Alice Chen",
	"Bob Smith",
	"Carol Wang",
	"David Lee",
	"Emma Zhang",
	"Frank Liu",
	"Grace Kim",
	"Henry Wu",
];

const tagOptions = [
	"GPT-4",
	"Claude",
	"Gemini",
	"productivity",
	"automation",
	"debugging",
	"refactoring",
	"documentation",
	"testing",
	"API",
	"frontend",
	"backend",
	"database",
	"devops",
	"security",
	"performance",
	"beginner",
	"advanced",
	"tutorial",
	"best-practices",
];

const promptTemplates = {
	Coding: [
		{
			title: "Code Review Assistant",
			content:
				"Review the following code for bugs, security issues, and performance problems. Provide specific suggestions for improvement with code examples.",
		},
		{
			title: "Unit Test Generator",
			content:
				"Generate comprehensive unit tests for the provided function/class. Include edge cases, error handling, and mock dependencies where needed.",
		},
		{
			title: "API Documentation Writer",
			content:
				"Create detailed API documentation for the following endpoints. Include request/response examples, error codes, and authentication requirements.",
		},
		{
			title: "Debug Helper",
			content:
				"Help me debug this error. Analyze the stack trace and code context to identify the root cause and suggest fixes.",
		},
		{
			title: "Refactoring Guide",
			content:
				"Suggest refactoring improvements for this code. Focus on readability, maintainability, and adherence to SOLID principles.",
		},
		{
			title: "SQL Query Optimizer",
			content:
				"Analyze and optimize this SQL query for better performance. Explain the improvements and provide the optimized version.",
		},
		{
			title: "TypeScript Type Helper",
			content:
				"Help me define proper TypeScript types for this data structure. Include generics where appropriate.",
		},
		{
			title: "React Component Builder",
			content:
				"Create a React component based on this specification. Use TypeScript, hooks, and follow best practices.",
		},
		{
			title: "Git Commit Message Writer",
			content:
				"Write a clear, descriptive git commit message for these changes following conventional commits format.",
		},
		{
			title: "Code Explainer",
			content:
				"Explain this code in detail. Break down complex parts and describe the overall logic flow.",
		},
	],
	Writing: [
		{
			title: "Blog Post Outline",
			content:
				"Create a detailed outline for a blog post about [topic]. Include introduction, main points, and conclusion structure.",
		},
		{
			title: "Email Composer",
			content:
				"Write a professional email for [purpose]. Keep it concise, clear, and appropriate for the business context.",
		},
		{
			title: "Technical Documentation",
			content:
				"Write technical documentation for this feature. Include overview, setup instructions, usage examples, and troubleshooting.",
		},
		{
			title: "Social Media Content",
			content:
				"Create engaging social media posts for [platform] about [topic]. Include relevant hashtags and call-to-action.",
		},
		{
			title: "Product Description",
			content:
				"Write a compelling product description that highlights key features, benefits, and use cases.",
		},
		{
			title: "Meeting Summary",
			content:
				"Summarize this meeting transcript. Include key decisions, action items, and next steps.",
		},
		{
			title: "Newsletter Draft",
			content:
				"Draft a newsletter about [topic]. Make it engaging, informative, and include a clear CTA.",
		},
		{
			title: "Press Release Template",
			content:
				"Write a press release for [announcement]. Follow standard press release format and style.",
		},
		{
			title: "FAQ Generator",
			content:
				"Generate frequently asked questions and answers for [product/service]. Cover common concerns and use cases.",
		},
		{
			title: "Proofreading Assistant",
			content:
				"Proofread and edit this text for grammar, clarity, and style. Suggest improvements while maintaining the original voice.",
		},
	],
	Translation: [
		{
			title: "Technical Translation",
			content:
				"Translate this technical document while preserving terminology accuracy and context. Maintain consistent terminology throughout.",
		},
		{
			title: "Marketing Localization",
			content:
				"Localize this marketing content for [target market]. Adapt cultural references and idioms appropriately.",
		},
		{
			title: "UI String Translation",
			content:
				"Translate these UI strings for [language]. Keep them concise and consider character limits.",
		},
		{
			title: "Legal Document Translation",
			content:
				"Translate this legal document accurately. Preserve legal terminology and formal tone.",
		},
		{
			title: "Subtitle Translation",
			content:
				"Translate these subtitles while keeping timing constraints and natural speech patterns in mind.",
		},
		{
			title: "Academic Translation",
			content:
				"Translate this academic paper while maintaining scholarly tone and proper citation format.",
		},
		{
			title: "Medical Translation",
			content:
				"Translate this medical document with precise medical terminology. Flag any ambiguous terms.",
		},
		{
			title: "Game Localization",
			content:
				"Localize this game content for [region]. Adapt humor, references, and maintain character voice.",
		},
		{
			title: "Website Translation",
			content:
				"Translate this website content for [language]. Optimize for SEO in the target language.",
		},
		{
			title: "Business Correspondence",
			content:
				"Translate this business letter while maintaining appropriate formality level for [culture].",
		},
	],
	Analysis: [
		{
			title: "Data Analysis Report",
			content:
				"Analyze this dataset and provide insights. Include statistical summary, trends, and actionable recommendations.",
		},
		{
			title: "Competitive Analysis",
			content:
				"Conduct a competitive analysis of [company/product]. Compare features, pricing, strengths, and weaknesses.",
		},
		{
			title: "Code Complexity Analysis",
			content:
				"Analyze the complexity of this codebase. Identify potential bottlenecks and areas for improvement.",
		},
		{
			title: "User Feedback Analysis",
			content:
				"Analyze these user reviews/feedback. Categorize issues, identify patterns, and prioritize improvements.",
		},
		{
			title: "Market Research Summary",
			content:
				"Summarize this market research data. Highlight key findings, trends, and opportunities.",
		},
		{
			title: "Performance Report",
			content:
				"Analyze these performance metrics. Identify issues, compare to benchmarks, and suggest optimizations.",
		},
		{
			title: "Risk Assessment",
			content:
				"Conduct a risk assessment for [project/decision]. Identify risks, likelihood, impact, and mitigation strategies.",
		},
		{
			title: "A/B Test Analysis",
			content:
				"Analyze these A/B test results. Determine statistical significance and provide recommendations.",
		},
		{
			title: "Cost-Benefit Analysis",
			content:
				"Perform a cost-benefit analysis for [proposal]. Quantify costs, benefits, and calculate ROI.",
		},
		{
			title: "Trend Analysis",
			content:
				"Analyze trends in this data over time. Identify patterns, seasonality, and make predictions.",
		},
	],
	Creative: [
		{
			title: "Story Idea Generator",
			content:
				"Generate creative story ideas based on [genre/theme]. Include plot hooks, character concepts, and setting details.",
		},
		{
			title: "Character Creator",
			content:
				"Create a detailed character profile including background, personality, motivations, and quirks.",
		},
		{
			title: "Brainstorming Partner",
			content:
				"Help brainstorm ideas for [project/problem]. Use techniques like mind mapping and lateral thinking.",
		},
		{
			title: "Naming Generator",
			content:
				"Generate creative names for [product/company/character]. Consider meaning, memorability, and availability.",
		},
		{
			title: "Dialogue Writer",
			content:
				"Write realistic dialogue between [characters] in [situation]. Capture distinct voices and subtext.",
		},
		{
			title: "World Builder",
			content:
				"Help build a fictional world including geography, culture, history, and unique elements.",
		},
		{
			title: "Poetry Assistant",
			content:
				"Help write a poem in [style] about [topic]. Focus on imagery, rhythm, and emotional impact.",
		},
		{
			title: "Slogan Creator",
			content:
				"Create catchy slogans for [brand/campaign]. Make them memorable, meaningful, and aligned with brand values.",
		},
		{
			title: "Plot Twist Generator",
			content:
				"Suggest plot twists for this story. Make them surprising yet logical within the established narrative.",
		},
		{
			title: "Creative Problem Solver",
			content:
				"Apply creative thinking to solve [problem]. Use unconventional approaches and think outside the box.",
		},
	],
};

function getRandomItems<T>(array: T[], count: number): T[] {
	const shuffled = [...array].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

function generateUserId(): string {
	return "00000000-0000-0000-0000-000000000000";
}

async function seed() {
	console.log("Seeding 100 prompts...");

	const promptsToInsert = [];
	let count = 0;

	for (const category of categories) {
		const templates = promptTemplates[category as keyof typeof promptTemplates];

		for (const template of templates) {
			// Create 2 variations of each template
			for (let i = 0; i < 2; i++) {
				const author = authors[Math.floor(Math.random() * authors.length)];
				const tags = getRandomItems(
					tagOptions,
					Math.floor(Math.random() * 4) + 1,
				);
				const favoritesCount = Math.floor(Math.random() * 100);

				promptsToInsert.push({
					title: i === 0 ? template.title : `${template.title} v2`,
					content: template.content,
					category,
					tags,
					author: author ?? "Anonymous",
					userId: generateUserId(),
					favoritesCount,
				});

				count++;
				if (count >= 100) break;
			}
			if (count >= 100) break;
		}
		if (count >= 100) break;
	}

	await db.insert(prompts).values(promptsToInsert);

	console.log(`Successfully inserted ${promptsToInsert.length} prompts!`);
	await client.end();
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
