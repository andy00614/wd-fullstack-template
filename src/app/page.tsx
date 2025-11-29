import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
					Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
				</h1>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
					<Link
						className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
						href="https://create.t3.gg/en/usage/first-steps"
						target="_blank"
					>
						<h3 className="font-bold text-2xl">First Steps</h3>
						<div className="text-lg">
							Just the basics - Everything you need to know to set up your
							database and authentication.
						</div>
					</Link>
					<Link
						className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
						href="https://create.t3.gg/en/introduction"
						target="_blank"
					>
						<h3 className="font-bold text-2xl">Documentation</h3>
						<div className="text-lg">
							Learn more about Create T3 App, the libraries it uses, and how to
							deploy it.
						</div>
					</Link>
				</div>
				<div className="flex flex-col items-center gap-2">
					<div className="flex flex-col items-center justify-center gap-4">
						<p className="text-center text-2xl text-white">
							{user && <span>Logged in as {user.email}</span>}
						</p>
						{!user ? (
							<form>
								<button
									className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
									formAction={async () => {
										"use server";
										const supabase = await createClient();
										const { data, error } =
											await supabase.auth.signInWithOAuth({
												provider: "google",
												options: {
													redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
												},
											});
										if (error) {
											throw new Error(error.message);
										}
										if (data.url) {
											redirect(data.url);
										}
									}}
									type="submit"
								>
									Sign in with Google
								</button>
							</form>
						) : (
							<div className="flex flex-col items-center gap-4">
								<Link
									href="/posts"
									className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold no-underline transition hover:bg-[hsl(280,100%,60%)]"
								>
									View Posts
								</Link>
								<form>
									<button
										className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
										formAction={async () => {
											"use server";
											const supabase = await createClient();
											await supabase.auth.signOut();
											redirect("/");
										}}
										type="submit"
									>
										Sign out
									</button>
								</form>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
