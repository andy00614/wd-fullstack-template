import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		exclude: ["node_modules", "e2e"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"e2e/",
				"**/*.config.*",
				"**/*.d.ts",
				"src/env.js",
			],
			thresholds: {
				statements: 50,
				branches: 50,
				functions: 50,
				lines: 50,
			},
		},
	},
});
