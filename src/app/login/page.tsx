import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import EyeCharacter from "@/components/eye-character";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/modules/auth";

export default async function LoginPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		redirect("/");
	}

	return (
		<main className="flex min-h-screen w-full bg-white text-[#1a1a1a] selection:bg-[#C4B5FD]/30">
			{/* Left Panel - Brand & Character */}
			<div className="relative hidden w-[55%] flex-col items-center justify-center bg-[#F3E8FF] p-12 lg:flex">
				<div className="relative z-10 flex flex-col items-center">
					<div className="mb-12">
						<EyeCharacter
							className="scale-125 shadow-2xl"
							color="#FFD56B"
							delay={0.2}
							shape="rounded"
						/>
					</div>
					<FadeIn delay={0.4}>
						<h2 className="text-center font-bold text-4xl text-[#6D28D9] tracking-tight">
							Build by rules.
							<br />
							Stay in flow.
						</h2>
					</FadeIn>
					<FadeIn delay={0.6}>
						<p className="mt-6 max-w-md text-center font-medium text-gray-600 text-lg">
							Your AI-powered development companion for building robust
							applications.
						</p>
					</FadeIn>

					{/* Decorative elements */}
					<div className="-top-20 -left-20 pointer-events-none absolute h-64 w-64 rounded-full bg-[#C4B5FD] opacity-20 blur-3xl" />
					<div className="-right-20 -bottom-20 pointer-events-none absolute h-64 w-64 rounded-full bg-[#FDE047] opacity-20 blur-3xl" />
				</div>

				{/* Curved Separator */}
				<div className="absolute top-0 right-0 bottom-0 z-20 h-full w-32 translate-x-[99%] overflow-hidden">
					<svg
						aria-hidden="true"
						className="h-full w-full"
						preserveAspectRatio="none"
						viewBox="0 0 100 100"
					>
						<path d="M0 0 C 50 0 50 100 0 100 Z" fill="#F3E8FF" />
					</svg>
				</div>
			</div>

			{/* Right Panel - Login Form */}
			<div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-[45%]">
				<div className="w-full max-w-sm">
					<FadeIn>
						<Link
							className="mb-12 flex cursor-pointer select-none items-center gap-2 font-bold text-xl tracking-tight"
							href="/"
						>
							<span className="font-black text-2xl">WD</span>
							<span className="font-medium text-gray-400">Template</span>
						</Link>
					</FadeIn>

					<div className="mb-8">
						<FadeIn delay={0.1}>
							<h1 className="mb-2 font-bold text-3xl tracking-tight">
								Welcome back
							</h1>
						</FadeIn>
						<FadeIn delay={0.2}>
							<p className="text-gray-500">
								Sign in to continue to your account
							</p>
						</FadeIn>
					</div>

					<FadeIn delay={0.3}>
						<LoginForm />
					</FadeIn>

					<FadeIn delay={0.4}>
						<div className="mt-6 text-center text-sm">
							<p className="text-gray-500">
								Don't have an account?{" "}
								<Link
									className="font-bold text-[#6D28D9] transition-colors hover:text-[#5B21B6]"
									href="/signup"
								>
									Sign up
								</Link>
							</p>
						</div>
					</FadeIn>

					<FadeIn delay={0.5}>
						<div className="mt-8 flex justify-center">
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
						</div>
					</FadeIn>
				</div>
			</div>
		</main>
	);
}
