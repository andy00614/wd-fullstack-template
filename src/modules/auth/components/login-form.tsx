"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn, Mail } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signInWithGoogle } from "../actions";

const loginSchema = z.object({
	email: z.email("Please enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	function onSubmit(data: LoginForm) {
		startTransition(async () => {
			const formData = new FormData();
			formData.set("email", data.email);
			formData.set("password", data.password);
			const result = await login(formData);
			if (result?.error) {
				toast.error(result.error);
			}
		});
	}

	function handleGoogleLogin() {
		startTransition(async () => {
			const result = await signInWithGoogle();
			if (result?.error) {
				toast.error(result.error);
			}
		});
	}

	return (
		<div className="flex w-full max-w-sm flex-col gap-4">
			<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<div className="space-y-2">
					<Label className="text-white" htmlFor="email">
						Email
					</Label>
					<Input
						{...register("email")}
						className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
						disabled={isPending}
						id="email"
						placeholder="you@example.com"
						type="email"
					/>
					{errors.email && (
						<p className="text-red-400 text-sm">{errors.email.message}</p>
					)}
				</div>
				<div className="space-y-2">
					<Label className="text-white" htmlFor="password">
						Password
					</Label>
					<Input
						{...register("password")}
						className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
						disabled={isPending}
						id="password"
						placeholder="Enter your password"
						type="password"
					/>
					{errors.password && (
						<p className="text-red-400 text-sm">{errors.password.message}</p>
					)}
				</div>
				<Button
					className="bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,60%)]"
					disabled={isPending}
					type="submit"
				>
					{isPending ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<LogIn className="mr-2 h-4 w-4" />
					)}
					{isPending ? "Signing in..." : "Sign in"}
				</Button>
			</form>
			<div className="flex items-center gap-4">
				<div className="h-px flex-1 bg-white/20" />
				<span className="text-white/50">or</span>
				<div className="h-px flex-1 bg-white/20" />
			</div>
			<Button
				className="bg-white/10 hover:bg-white/20"
				disabled={isPending}
				onClick={handleGoogleLogin}
				type="button"
				variant="ghost"
			>
				{isPending ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Mail className="mr-2 h-4 w-4" />
				)}
				Sign in with Google
			</Button>
		</div>
	);
}
