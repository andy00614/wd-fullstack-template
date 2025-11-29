"use client";

import { useState, useTransition } from "react";
import { login, signInWithGoogle } from "./actions";

export function LoginForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		setError(null);
		startTransition(async () => {
			const result = await login(formData);
			if (result?.error) {
				setError(result.error);
			}
		});
	}

	async function handleGoogleLogin() {
		startTransition(async () => {
			await signInWithGoogle();
		});
	}

	return (
		<div className="flex w-full max-w-sm flex-col gap-4">
			{error && (
				<div className="rounded-lg bg-red-500/20 px-4 py-2 text-red-300">
					{error}
				</div>
			)}
			<form action={handleSubmit} className="flex flex-col gap-4">
				<input
					className="rounded-lg bg-white/10 px-4 py-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
					disabled={isPending}
					name="email"
					placeholder="Email"
					required
					type="email"
				/>
				<input
					className="rounded-lg bg-white/10 px-4 py-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
					disabled={isPending}
					name="password"
					placeholder="Password"
					required
					type="password"
				/>
				<button
					className="rounded-full bg-[hsl(280,100%,70%)] px-6 py-3 font-semibold transition hover:bg-[hsl(280,100%,60%)] disabled:opacity-50"
					disabled={isPending}
					type="submit"
				>
					{isPending ? "Signing in..." : "Sign in"}
				</button>
			</form>
			<div className="flex items-center gap-4">
				<div className="h-px flex-1 bg-white/20" />
				<span className="text-white/50">or</span>
				<div className="h-px flex-1 bg-white/20" />
			</div>
			<button
				className="rounded-full bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
				disabled={isPending}
				onClick={handleGoogleLogin}
				type="button"
			>
				Sign in with Google
			</button>
		</div>
	);
}
