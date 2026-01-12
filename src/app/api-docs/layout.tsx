import { ApiSidebar } from "@/modules/api-docs/components";
import { apiGroups } from "@/modules/api-docs/data/endpoints";

export const metadata = {
	title: "API Documentation",
	description: "Explore and test API endpoints",
};

export default function ApiDocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			<ApiSidebar groups={apiGroups} />
			<main className="flex-1 overflow-auto">{children}</main>
		</div>
	);
}
