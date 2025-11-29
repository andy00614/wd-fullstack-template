"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function FadeIn({
	children,
	delay = 0,
}: {
	children: ReactNode;
	delay?: number;
}) {
	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.4, delay }}
		>
			{children}
		</motion.div>
	);
}

export function StaggerContainer({
	children,
	staggerDelay = 0.1,
}: {
	children: ReactNode;
	staggerDelay?: number;
}) {
	return (
		<motion.div
			animate="visible"
			initial="hidden"
			variants={{
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: {
						staggerChildren: staggerDelay,
					},
				},
			}}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children }: { children: ReactNode }) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0 },
			}}
		>
			{children}
		</motion.div>
	);
}
