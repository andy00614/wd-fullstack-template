"use client";

import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
	words: string;
	className?: string;
	filter?: boolean;
	duration?: number;
}

export function TextGenerateEffect({
	words,
	className,
	filter = true,
	duration = 0.5,
}: TextGenerateEffectProps) {
	const [scope, animate] = useAnimate();
	const isInView = useInView(scope, { once: true });
	const wordsArray = words.split(" ");
	const id = useId();

	useEffect(() => {
		if (isInView) {
			animate(
				"span",
				{
					opacity: 1,
					filter: filter ? "blur(0px)" : "none",
				},
				{
					duration: duration,
					delay: stagger(0.1),
				},
			);
		}
	}, [isInView, animate, filter, duration]);

	return (
		<motion.span className={cn("inline", className)} ref={scope}>
			{wordsArray.map((word, wordIndex) => (
				<motion.span
					className="opacity-0"
					key={`${id}-${word}-${wordIndex.toString()}`}
					style={{
						filter: filter ? "blur(10px)" : "none",
					}}
				>
					{word}{" "}
				</motion.span>
			))}
		</motion.span>
	);
}
