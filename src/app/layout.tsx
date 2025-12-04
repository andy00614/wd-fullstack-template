import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	authors: siteConfig.authors,
	creator: siteConfig.creator,
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
		],
		shortcut: "/favicon-32x32.png",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.title,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.title,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.title,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
		creator: siteConfig.creator,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: siteConfig.url,
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
	],
	width: "device-width",
	initialScale: 1,
};

const nunito = Nunito({
	subsets: ["latin"],
	variable: "--font-nunito",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${nunito.variable}`} lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
