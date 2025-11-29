import { FileText, LogIn, LogOut, UserPlus } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<FadeIn>
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
						Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
					</h1>
				</FadeIn>

				<StaggerContainer staggerDelay={0.1}>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
						<StaggerItem>
							<Link
								className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/20"
								href="https://create.t3.gg/en/usage/first-steps"
								target="_blank"
							>
								<h3 className="font-bold text-2xl">First Steps</h3>
								<div className="text-lg">
									Just the basics - Everything you need to know to set up your
									database and authentication.
								</div>
							</Link>
						</StaggerItem>
						<StaggerItem>
							<Link
								className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/20"
								href="https://create.t3.gg/en/introduction"
								target="_blank"
							>
								<h3 className="font-bold text-2xl">Documentation</h3>
								<div className="text-lg">
									Learn more about Create T3 App, the libraries it uses, and how
									to deploy it.
								</div>
							</Link>
						</StaggerItem>
					</div>
				</StaggerContainer>

				<FadeIn delay={0.3}>
					<div className="flex flex-col items-center gap-4">
						{user && (
							<p className="text-center text-2xl text-white">
								Logged in as {user.email}
							</p>
						)}
						{!user ? (
							<div className="flex gap-4">
								<Button
									asChild
									className="bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,60%)]"
									size="lg"
								>
									<Link href="/login">
										<LogIn className="mr-2 h-4 w-4" />
										Sign in
									</Link>
								</Button>
								<Button asChild size="lg" variant="ghost">
									<Link href="/signup">
										<UserPlus className="mr-2 h-4 w-4" />
										Sign up
									</Link>
								</Button>
							</div>
						) : (
							<div className="flex gap-4">
								<Button
									asChild
									className="bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,60%)]"
									size="lg"
								>
									<Link href="/posts">
										<FileText className="mr-2 h-4 w-4" />
										View Posts
									</Link>
								</Button>
								<Button asChild size="lg" variant="ghost">
									<Link href="/signout">
										<LogOut className="mr-2 h-4 w-4" />
										Sign out
									</Link>
								</Button>
							</div>
						)}
					</div>
				</FadeIn>
			</div>
		</main>
	);
}
