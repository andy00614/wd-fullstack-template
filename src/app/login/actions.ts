"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: FormData) {
	const supabase = await createClient();

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		return { error: error.message };
	}

	// Check if email confirmation is required
	// If user.identities is empty, the user already exists
	if (data.user?.identities?.length === 0) {
		return { error: "An account with this email already exists" };
	}

	// If session is null but user exists, email confirmation is required
	if (data.user && !data.session) {
		return {
			success: true,
			message: "Check your email for the confirmation link",
		};
	}

	// If we have a session, user is logged in (email confirmation disabled)
	revalidatePath("/", "layout");
	redirect("/");
}

export async function signInWithGoogle() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
		},
	});

	if (error) {
		return { error: error.message };
	}

	if (data.url) {
		redirect(data.url);
	}
}
