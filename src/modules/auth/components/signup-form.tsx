"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "../actions";

const signupSchema = z.object({
	email: z.email("Please enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupForm() {
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupForm>({
		resolver: zodResolver(signupSchema),
	});

	function onSubmit(data: SignupForm) {
		startTransition(async () => {
			const formData = new FormData();
			formData.set("email", data.email);
			formData.set("password", data.password);
			const result = await signup(formData);
			if (result?.error) {
				toast.error(result.error);
			} else if (result?.success) {
				toast.success(result.message);
			}
		});
	}

	return (
		<div className="flex w-full max-w-sm flex-col gap-4">
			<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<div className="space-y-2">
					<Label className="text-[#1a1a1a]" htmlFor="email">
						Email
					</Label>
					<Input
						{...register("email")}
						className="border-gray-200 bg-white text-[#1a1a1a] placeholder:text-gray-400 focus:border-[#C4B5FD] focus:ring-[#C4B5FD]"
						disabled={isPending}
						id="email"
						placeholder="you@example.com"
						type="email"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">{errors.email.message}</p>
					)}
				</div>
				<div className="space-y-2">
					<Label className="text-[#1a1a1a]" htmlFor="password">
						Password
					</Label>
					<Input
						{...register("password")}
						className="border-gray-200 bg-white text-[#1a1a1a] placeholder:text-gray-400 focus:border-[#C4B5FD] focus:ring-[#C4B5FD]"
						disabled={isPending}
						id="password"
						placeholder="At least 6 characters"
						type="password"
					/>
					{errors.password && (
						<p className="text-red-500 text-sm">{errors.password.message}</p>
					)}
				</div>
				<Button
					className="rounded-xl bg-black font-bold text-white transition-all hover:scale-[1.02] hover:bg-black/90"
					disabled={isPending}
					type="submit"
				>
					{isPending ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<UserPlus className="mr-2 h-4 w-4" />
					)}
					{isPending ? "Creating account..." : "Create account"}
				</Button>
			</form>
		</div>
	);
}
