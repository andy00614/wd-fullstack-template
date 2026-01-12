import { notFound } from "next/navigation";
import {
	CodeBlock,
	EndpointHeader,
	EndpointPlayground,
	ParametersTable,
} from "@/modules/api-docs/components";
import {
	getAllEndpoints,
	getEndpointById,
} from "@/modules/api-docs/data/endpoints";

interface EndpointPageProps {
	params: Promise<{ endpoint: string }>;
}

export async function generateStaticParams() {
	const endpoints = getAllEndpoints();
	return endpoints.map((endpoint) => ({
		endpoint: endpoint.id,
	}));
}

export async function generateMetadata({ params }: EndpointPageProps) {
	const { endpoint: endpointId } = await params;
	const endpoint = getEndpointById(endpointId);

	if (!endpoint) {
		return { title: "Endpoint Not Found" };
	}

	return {
		title: `${endpoint.method} ${endpoint.path} - API Docs`,
		description: endpoint.description,
	};
}

export default async function EndpointPage({ params }: EndpointPageProps) {
	const { endpoint: endpointId } = await params;
	const endpoint = getEndpointById(endpointId);

	if (!endpoint) {
		notFound();
	}

	return (
		<div className="mx-auto max-w-4xl px-8 py-12">
			<div className="space-y-8">
				{/* Header */}
				<EndpointHeader endpoint={endpoint} />

				{/* Playground */}
				<section className="space-y-4">
					<h2 className="font-semibold text-gray-900 text-lg dark:text-gray-100">
						Try it out
					</h2>
					<div className="rounded-xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<EndpointPlayground endpoint={endpoint} />
					</div>
				</section>

				{/* Parameters Documentation */}
				{endpoint.pathParameters && endpoint.pathParameters.length > 0 && (
					<section>
						<ParametersTable
							parameters={endpoint.pathParameters}
							title="Path Parameters"
						/>
					</section>
				)}

				{endpoint.queryParameters && endpoint.queryParameters.length > 0 && (
					<section>
						<ParametersTable
							parameters={endpoint.queryParameters}
							title="Query Parameters"
						/>
					</section>
				)}

				{endpoint.bodyParameters && endpoint.bodyParameters.length > 0 && (
					<section>
						<ParametersTable
							parameters={endpoint.bodyParameters}
							title="Request Body"
						/>
					</section>
				)}

				{/* Response Examples */}
				<section className="space-y-4">
					<h2 className="font-semibold text-gray-900 text-lg dark:text-gray-100">
						Response Examples
					</h2>
					<div className="space-y-4">
						{endpoint.responses.map((response) => (
							<div className="space-y-2" key={response.statusCode}>
								<div className="flex items-center gap-2">
									<span
										className={`rounded px-2 py-0.5 font-medium text-xs ${
											response.statusCode < 300
												? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
												: response.statusCode < 400
													? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
													: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
										}`}
									>
										{response.statusCode}
									</span>
									<span className="text-gray-600 text-sm dark:text-gray-400">
										{response.description}
									</span>
								</div>
								{response.body !== null && (
									<CodeBlock code={JSON.stringify(response.body, null, 2)} />
								)}
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
