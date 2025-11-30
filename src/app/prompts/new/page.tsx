import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { PromptForm } from "@/modules/prompts";

export default async function NewPromptPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
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
					<h1 className="mb-2 font-bold text-3xl text-[#1a1a1a] tracking-tight">
						Create New Prompt
					</h1>
					<p className="text-gray-500">
						Share your prompt with the community. Add a descriptive title and
						tags to help others find it.
					</p>
				</div>

				<PromptForm mode="create" />
			</div>
		</main>
	);
}
