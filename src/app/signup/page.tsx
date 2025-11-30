import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "@/modules/auth";

export default async function SignupPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		redirect("/");
	}

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white text-[#1a1a1a] selection:bg-[#C4B5FD]/30">
			{/* Decorative elements */}
			<div className="pointer-events-none absolute top-10 right-20 h-40 w-40 rounded-full bg-[#C4B5FD] opacity-50 blur-3xl" />
			<div className="pointer-events-none absolute bottom-10 left-20 h-32 w-32 rounded-full bg-[#FDE047] opacity-50 blur-3xl" />
			<div className="pointer-events-none absolute top-1/2 left-1/4 h-24 w-24 rounded-full bg-[#F3E8FF] opacity-60 blur-2xl" />

			<div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 py-16">
				<FadeIn>
					<Link
						className="mb-4 flex cursor-pointer select-none items-center gap-2 font-bold text-xl tracking-tight"
						href="/"
					>
						<span className="font-black text-2xl">WD</span>
						<span className="font-medium text-gray-400">Template</span>
					</Link>
				</FadeIn>
				<FadeIn delay={0.05}>
					<h1 className="font-bold text-4xl tracking-tight">Create account</h1>
				</FadeIn>
				<FadeIn delay={0.1}>
					<p className="text-center text-gray-500">
						Get started with your free account
					</p>
				</FadeIn>
				<FadeIn delay={0.15}>
					<SignupForm />
				</FadeIn>
				<FadeIn delay={0.2}>
					<p className="text-gray-500">
						Already have an account?{" "}
						<Link
							className="font-medium text-[#6D28D9] transition-colors hover:text-[#5B21B6]"
							href="/login"
						>
							Sign in
						</Link>
					</p>
				</FadeIn>
				<FadeIn delay={0.25}>
					<Button
						asChild
						className="text-gray-500 hover:text-[#1a1a1a]"
						variant="ghost"
					>
						<Link href="/">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to home
						</Link>
					</Button>
				</FadeIn>
			</div>
		</main>
	);
}
