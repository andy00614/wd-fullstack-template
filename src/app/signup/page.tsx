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
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
				<FadeIn>
					<h1 className="font-extrabold text-4xl tracking-tight">Sign Up</h1>
				</FadeIn>
				<FadeIn delay={0.1}>
					<SignupForm />
				</FadeIn>
				<FadeIn delay={0.2}>
					<p className="text-white/60">
						Already have an account?{" "}
						<Link
							className="text-[hsl(280,100%,70%)] hover:underline"
							href="/login"
						>
							Sign in
						</Link>
					</p>
				</FadeIn>
				<FadeIn delay={0.3}>
					<Button asChild variant="ghost">
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
