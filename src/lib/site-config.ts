export const siteConfig = {
	name: "WD Template",
	title: "WD Fullstack Template - AI-Powered Development Workflow",
	description:
		"Build faster with state machine driven workflows, enforced standards, and built-in validation. A modern fullstack template designed to help you ship with precision.",
	url: "https://wd-template.vercel.app", // TODO: Update with your actual domain
	ogImage: "/og-image.png",
	creator: "@andy00614",
	keywords: [
		"Next.js",
		"React",
		"TypeScript",
		"Supabase",
		"Tailwind CSS",
		"Drizzle ORM",
		"Fullstack Template",
		"AI Development",
		"State Machine",
		"MCP",
	] as string[],
	authors: [{ name: "Andy", url: "https://github.com/andy00614" }] as {
		name: string;
		url?: string;
	}[],
	links: {
		github: "https://github.com/andy00614/wd-fullstack-template",
	},
};

export type SiteConfig = typeof siteConfig;
