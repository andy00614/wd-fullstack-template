"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deletePrompt } from "../actions";

interface DeletePromptButtonProps {
	promptId: string;
}

export function DeletePromptButton({ promptId }: DeletePromptButtonProps) {
	const [isPending, startTransition] = useTransition();

	function handleDelete() {
		if (!confirm("Are you sure you want to delete this prompt?")) {
			return;
		}

		startTransition(async () => {
			const formData = new FormData();
			formData.set("id", promptId);
			const result = await deletePrompt(formData);
			toast.success(`Prompt deleted in ${result.duration}ms`);
		});
	}

	return (
		<Button
			disabled={isPending}
			onClick={handleDelete}
			size="sm"
			type="button"
			variant="destructive"
		>
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Trash2 className="h-4 w-4" />
			)}
		</Button>
	);
}
