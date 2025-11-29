"use client";

import { useState, useTransition } from "react";
import { signup } from "../login/actions";

export function SignupForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		setError(null);
		setSuccess(null);
		startTransition(async () => {
			const result = await signup(formData);
			if (result?.error) {
				setError(result.error);
			} else if (result?.success) {
				setSuccess(result.message);
			}
		});
	}

	if (success) {
		return (
			<div className="flex w-full max-w-sm flex-col gap-4">
				<div className="rounded-lg bg-green-500/20 px-4 py-4 text-center text-green-300">
					{success}
				</div>
			</div>
		);
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
					placeholder="Password (min 6 characters)"
					minLength={6}
					required
					type="password"
				/>
				<button
					className="rounded-full bg-[hsl(280,100%,70%)] px-6 py-3 font-semibold transition hover:bg-[hsl(280,100%,60%)] disabled:opacity-50"
					disabled={isPending}
					type="submit"
				>
					{isPending ? "Creating account..." : "Create account"}
				</button>
			</form>
		</div>
	);
}
