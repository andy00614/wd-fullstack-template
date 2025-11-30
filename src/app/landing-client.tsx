"use client";

import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import EyeCharacter from "@/components/eye-character";
import { Button } from "@/components/ui/button";

const StarSticker = ({ text }: { text: string }) => (
	<span className="relative mx-2 inline-flex items-center justify-center align-middle">
		<svg
			aria-hidden="true"
			className="-z-10 absolute h-20 w-20 rotate-12 fill-current text-[#C4B5FD]"
			viewBox="0 0 100 100"
		>
			<path d="M50 0L61 35H98L68 57L79 91L50 70L21 91L32 57L2 35H39L50 0Z" />
		</svg>
		<span className="relative z-10 rotate-6 font-bold text-[#6D28D9] text-sm">
			{text}
		</span>
	</span>
);

const CircleSticker = ({ text }: { text: string }) => (
	<span className="relative mx-2 inline-flex items-center justify-center align-middle">
		<div className="-z-10 absolute h-16 w-16 rounded-full border-2 border-gray-200 bg-white" />
		<span className="-rotate-12 relative z-10 font-bold text-gray-500 text-sm">
			{text}
		</span>
	</span>
);

const NoteSticker = ({ text }: { text: string }) => (
	<span className="relative mx-2 inline-flex items-center justify-center align-middle">
		<div className="-z-10 absolute h-14 w-16 rotate-3 rounded-sm bg-[#FDE047] shadow-sm" />
		<span className="relative z-10 rotate-3 font-bold text-gray-800 text-lg">
			{text}
		</span>
	</span>
);

interface LandingClientProps {
	user: User | null;
}

export function LandingClient({ user }: LandingClientProps) {
	return (
		<div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-sans text-[#1a1a1a] selection:bg-[#C4B5FD]/30">
			{/* Navbar */}
			<nav className="z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8">
				<Link
					className="flex cursor-pointer select-none items-center gap-2 font-bold text-xl tracking-tight"
					href="/"
				>
					<span className="font-black text-2xl">WD</span>
					<span className="font-medium text-gray-400">Template</span>
				</Link>
				<div className="hidden items-center gap-10 font-medium text-[15px] text-gray-600 md:flex">
					<a className="transition-colors hover:text-black" href="#features">
						Features
					</a>
					<a className="transition-colors hover:text-black" href="#stack">
						Tech Stack
					</a>
					<a
						className="transition-colors hover:text-black"
						href="https://github.com/andy00614/wd-fullstack-template"
						rel="noreferrer"
						target="_blank"
					>
						GitHub
					</a>
				</div>
				<div className="flex items-center gap-4">
					{!user ? (
						<>
							<Button asChild size="sm" variant="ghost">
								<Link href="/login">
									<LogIn className="mr-2 h-4 w-4" />
									Sign in
								</Link>
							</Button>
							<Button
								asChild
								className="cursor-pointer rounded-xl bg-[#F3E8FF] px-6 py-2.5 font-bold text-[#1a1a1a] text-[15px] transition-colors hover:bg-[#e9d5ff]"
							>
								<Link href="/signup">Get Started</Link>
							</Button>
						</>
					) : (
						<>
							<span className="text-gray-600 text-sm">{user.email}</span>
							<Button
								asChild
								className="cursor-pointer rounded-xl bg-[#F3E8FF] px-6 py-2.5 font-bold text-[#1a1a1a] text-[15px] transition-colors hover:bg-[#e9d5ff]"
							>
								<Link href="/posts">Dashboard</Link>
							</Button>
							<Button asChild size="sm" variant="ghost">
								<Link href="/signout">
									<LogOut className="h-4 w-4" />
								</Link>
							</Button>
						</>
					)}
				</div>
			</nav>

			{/* Hero Content */}
			<main className="relative mx-auto mt-10 mb-32 flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4">
				{/* Centered Typography */}
				<div className="relative z-10 mx-auto max-w-5xl text-center">
					<motion.h1
						animate={{ opacity: 1, y: 0 }}
						className="font-bold text-4xl text-[#1a1a1a] leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					>
						Build by rules
						<StarSticker text="Zod" />
						<br className="hidden md:block" />
						Stay in flow
						<CircleSticker text="State" />
						<br />
						Let AI be your teammate
						<NoteSticker text="MCP" />
					</motion.h1>

					<motion.p
						animate={{ opacity: 1 }}
						className="mx-auto mt-10 max-w-xl font-medium text-gray-500 text-lg leading-relaxed"
						initial={{ opacity: 0 }}
						transition={{ delay: 0.4, duration: 0.8 }}
					>
						Stop AI from running wild. State machine driven workflows, enforced
						standards, and built-in validation designed to help you ship with
						precision.
					</motion.p>

					<motion.div
						animate={{ opacity: 1, scale: 1 }}
						className="mt-12"
						initial={{ opacity: 0, scale: 0.9 }}
						transition={{ delay: 0.6, type: "spring" }}
					>
						<Link
							className="mx-auto flex cursor-pointer items-center gap-2 rounded-full bg-black px-8 py-4 font-bold text-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
							href="https://github.com/andy00614/wd-fullstack-template"
							style={{ width: "fit-content" }}
							target="_blank"
						>
							Clone Template <ArrowRight className="h-5 w-5" />
						</Link>
					</motion.div>

					{/* Stats */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="mx-auto mt-24 grid max-w-2xl grid-cols-3 gap-12"
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.8, duration: 0.8 }}
					>
						<div>
							<div className="font-bold text-3xl text-black">100%</div>
							<div className="mt-1 font-medium text-gray-400 text-sm">
								Validation
							</div>
						</div>
						<div>
							<div className="font-bold text-3xl text-black">Zero</div>
							<div className="mt-1 font-medium text-gray-400 text-sm">
								Hallucinations
							</div>
						</div>
						<div>
							<div className="font-bold text-3xl text-black">v1.0</div>
							<div className="mt-1 font-medium text-gray-400 text-sm">
								Public Beta
							</div>
						</div>
					</motion.div>
				</div>

				{/* Characters - Yellow Chick (left) and Purple Penguin (right) */}
				<div className="pointer-events-none absolute bottom-0 left-10 hidden lg:block xl:left-20">
					<EyeCharacter
						className="-rotate-6 transition-transform duration-500 hover:rotate-0"
						color="#FFD56B"
						delay={0.8}
						shape="rounded"
					/>
					{/* Doodles/Notes near yellow character */}
					<div className="-rotate-12 pointer-events-none absolute top-10 left-0 opacity-80">
						<div className="flex h-16 w-12 flex-col gap-2 rounded-sm border-2 border-purple-300 bg-purple-200 p-2">
							<div className="h-1 w-full rounded-full bg-purple-300" />
							<div className="h-1 w-2/3 rounded-full bg-purple-300" />
						</div>
					</div>
				</div>

				<div className="pointer-events-none absolute right-10 bottom-10 hidden lg:block xl:right-20">
					<EyeCharacter
						className="rotate-12 transition-transform duration-500 hover:rotate-6"
						color="#E0D4FC"
						delay={1.0}
						shape="blob"
					/>
					{/* Doodles/Paper near purple character */}
					<div className="-top-16 -left-10 pointer-events-none absolute flex h-24 w-20 rotate-6 flex-col gap-2 border-2 border-gray-100 bg-white p-3 shadow-sm">
						<div className="h-1.5 w-full rounded-full bg-gray-100" />
						<div className="h-1.5 w-full rounded-full bg-gray-100" />
						<div className="h-1.5 w-3/4 rounded-full bg-gray-100" />
						<div className="h-1.5 w-1/2 rounded-full bg-gray-100" />
					</div>
				</div>
			</main>
		</div>
	);
}
