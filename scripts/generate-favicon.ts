import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const sizes = [16, 32, 180, 192, 512];

async function generateFavicons() {
	const svgPath = resolve(import.meta.dirname, "../public/favicon.svg");
	const svgContent = readFileSync(svgPath, "utf-8");

	const browser = await chromium.launch();

	for (const size of sizes) {
		const page = await browser.newPage();
		await page.setViewportSize({ width: size, height: size });

		const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; }
            body { width: ${size}px; height: ${size}px; }
            svg { width: 100%; height: 100%; }
          </style>
        </head>
        <body>${svgContent}</body>
      </html>
    `;

		await page.setContent(html);
		const buffer = await page.screenshot({ type: "png", omitBackground: true });

		let filename: string;
		if (size === 16) {
			filename = "favicon-16x16.png";
		} else if (size === 32) {
			filename = "favicon-32x32.png";
		} else if (size === 180) {
			filename = "apple-touch-icon.png";
		} else if (size === 192) {
			filename = "android-chrome-192x192.png";
		} else {
			filename = "android-chrome-512x512.png";
		}

		const outputPath = resolve(import.meta.dirname, "../public", filename);
		writeFileSync(outputPath, buffer);
		console.log(`Generated: ${filename}`);

		await page.close();
	}

	await browser.close();
	console.log("Done! Favicon images generated.");
}

generateFavicons().catch(console.error);
