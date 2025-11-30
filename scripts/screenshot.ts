import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000";
const output = process.argv[3] || "screenshot.png";
const viewport = {
	width: Number.parseInt(process.argv[4] || "1280"),
	height: Number.parseInt(process.argv[5] || "800"),
};

async function capture() {
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport });

	console.log(`Navigating to ${url}...`);
	await page.goto(url, { waitUntil: "networkidle" });

	await page.screenshot({ path: output, fullPage: true });
	console.log(`Screenshot saved: ${output}`);

	await browser.close();
}

capture().catch((err) => {
	console.error("Screenshot failed:", err.message);
	process.exit(1);
});
