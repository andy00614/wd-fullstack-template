"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";

async function getAuthUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		redirect("/");
	}
	return user;
}

export async function createPost(formData: FormData) {
	const start = performance.now();

	const authStart = performance.now();
	const user = await getAuthUser();
	const authDuration = performance.now() - authStart;

	const title = formData.get("title") as string;
	const content = formData.get("content") as string;

	const dbStart = performance.now();
	await db.insert(posts).values({
		title,
		content,
		userId: user.id,
	});
	const dbDuration = performance.now() - dbStart;

	const duration = performance.now() - start;
	console.log(
		`[CREATE] Total: ${duration.toFixed(2)}ms | Auth: ${authDuration.toFixed(2)}ms | DB: ${dbDuration.toFixed(2)}ms`,
	);

	revalidatePath("/posts");
	return {
		duration: duration.toFixed(2),
		authDuration: authDuration.toFixed(2),
		dbDuration: dbDuration.toFixed(2),
	};
}

export async function updatePost(formData: FormData) {
	const start = performance.now();
	await getAuthUser();
	const id = formData.get("id") as string;
	const title = formData.get("title") as string;
	const content = formData.get("content") as string;

	await db
		.update(posts)
		.set({
			title,
			content,
			updatedAt: new Date(),
		})
		.where(eq(posts.id, id));

	const duration = performance.now() - start;
	console.log(`[UPDATE] Post ${id} updated in ${duration.toFixed(2)}ms`);

	revalidatePath("/posts");
	return { duration: duration.toFixed(2) };
}

export async function deletePost(formData: FormData) {
	const start = performance.now();
	await getAuthUser();
	const id = formData.get("id") as string;

	await db.delete(posts).where(eq(posts.id, id));

	const duration = performance.now() - start;
	console.log(`[DELETE] Post ${id} deleted in ${duration.toFixed(2)}ms`);

	revalidatePath("/posts");
	return { duration: duration.toFixed(2) };
}
