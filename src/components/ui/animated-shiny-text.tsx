"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
	children: ReactNode;
	className?: string;
	shimmerWidth?: number;
}

export function AnimatedShinyText({
	children,
	className,
	shimmerWidth = 100,
}: AnimatedShinyTextProps) {
	return (
		<span
			className={cn(
				"animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
				"bg-gradient-to-r from-transparent via-50% via-black/80 to-transparent dark:via-white/80",
				className,
			)}
			style={
				{
					"--shiny-width": `${shimmerWidth}px`,
				} as CSSProperties
			}
		>
			{children}
		</span>
	);
}
