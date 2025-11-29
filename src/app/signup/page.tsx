import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "./signup-form";

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
				<h1 className="font-extrabold text-4xl tracking-tight">Sign Up</h1>
				<SignupForm />
				<p className="text-white/60">
					Already have an account?{" "}
					<Link href="/login" className="text-[hsl(280,100%,70%)] hover:underline">
						Sign in
					</Link>
				</p>
				<Link href="/" className="text-white/60 hover:text-white">
					Back to home
				</Link>
			</div>
		</main>
	);
}
