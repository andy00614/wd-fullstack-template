import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
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
				<h1 className="font-extrabold text-4xl tracking-tight">Sign In</h1>
				<LoginForm />
				<p className="text-white/60">
					Don't have an account?{" "}
					<Link href="/signup" className="text-[hsl(280,100%,70%)] hover:underline">
						Sign up
					</Link>
				</p>
				<Link href="/" className="text-white/60 hover:text-white">
					Back to home
				</Link>
			</div>
		</main>
	);
}
