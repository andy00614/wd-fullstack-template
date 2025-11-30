import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getPromptById, PromptForm } from "@/modules/prompts";

interface EditPromptPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditPromptPage({ params }: EditPromptPageProps) {
	const { id } = await params;

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect(`/login?redirect=/prompts/${id}/edit`);
	}

	const prompt = await getPromptById(id);

	if (!prompt) {
		notFound();
	}

	if (prompt.userId !== user.id) {
		redirect("/prompts");
	}

	return (
		<main className="min-h-screen bg-white">
			{/* Header */}
			<div className="border-gray-100 border-b">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
					<Link
						className="flex cursor-pointer select-none items-center gap-2 font-bold text-xl tracking-tight"
						href="/"
					>
						<span className="font-black text-2xl">WD</span>
						<span className="font-medium text-gray-400">Template</span>
					</Link>
					<Button
						asChild
						className="text-gray-500 hover:text-[#1a1a1a]"
						variant="ghost"
					>
						<Link href="/prompts">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to prompts
						</Link>
					</Button>
				</div>
			</div>

			{/* Main content */}
			<div className="mx-auto max-w-2xl px-6 py-12">
				<div className="mb-8">
					<h1 className="mb-2 font-bold text-3xl text-[#1a1a1a]">Edit Prompt</h1>
					<p className="text-gray-500">
						Update your prompt details and save your changes.
					</p>
				</div>

				<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
					<PromptForm mode="edit" prompt={prompt} />
				</div>
			</div>
		</main>
	);
}
