"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface EyeProps {
	mouseX: number;
	mouseY: number;
	containerRef: React.RefObject<HTMLDivElement | null>;
	size?: number;
}

function Eye({ mouseX, mouseY, containerRef, size = 24 }: EyeProps) {
	const eyeRef = useRef<HTMLDivElement>(null);
	const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (!eyeRef.current || !containerRef.current) return;

		const eyeRect = eyeRef.current.getBoundingClientRect();
		const eyeCenterX = eyeRect.left + eyeRect.width / 2;
		const eyeCenterY = eyeRect.top + eyeRect.height / 2;

		const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
		const maxMove = size / 4;
		const distance = Math.min(
			maxMove,
			Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 10,
		);

		const x = Math.cos(angle) * distance;
		const y = Math.sin(angle) * distance;

		setPupilPos({ x, y });
	}, [mouseX, mouseY, size, containerRef]);

	return (
		<div
			className="relative flex items-center justify-center overflow-hidden rounded-full bg-white"
			ref={eyeRef}
			style={{ width: size, height: size }}
		>
			<motion.div
				animate={{ x: pupilPos.x, y: pupilPos.y }}
				className="absolute rounded-full bg-black"
				style={{ width: size * 0.4, height: size * 0.4 }}
				transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
			/>
		</div>
	);
}

interface EyeCharacterProps {
	className?: string;
	delay?: number;
	color?: string;
	shape?: "rounded" | "blob";
}

export default function EyeCharacter({
	className,
	delay = 0,
	color = "#FFD56B",
	shape = "rounded",
}: EyeCharacterProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const borderRadius =
		shape === "blob" ? "40% 60% 70% 30% / 40% 50% 60% 50%" : "3rem";

	return (
		<motion.div
			animate={{ scale: 1, opacity: 1 }}
			className={`relative flex h-48 w-48 items-center justify-center gap-3 shadow-xl ${className}`}
			initial={{ scale: 0, opacity: 0 }}
			ref={containerRef}
			style={{
				backgroundColor: color,
				borderRadius: borderRadius,
			}}
			transition={{
				type: "spring",
				stiffness: 260,
				damping: 20,
				delay: delay,
			}}
		>
			<Eye
				containerRef={containerRef}
				mouseX={mousePos.x}
				mouseY={mousePos.y}
				size={56}
			/>
			<Eye
				containerRef={containerRef}
				mouseX={mousePos.x}
				mouseY={mousePos.y}
				size={56}
			/>

			{/* Simple beak/mouth */}
			<div className="absolute bottom-10 h-4 w-8 rounded-full bg-orange-400 opacity-80" />

			{/* Cute little arms/wings based on shape */}
			{shape === "blob" && (
				<>
					<div
						className="-left-4 absolute top-20 h-12 w-12 rounded-full opacity-100"
						style={{ backgroundColor: color, zIndex: -1 }}
					/>
					<div
						className="-right-4 absolute bottom-10 h-12 w-12 rounded-full opacity-100"
						style={{ backgroundColor: color, zIndex: -1 }}
					/>
				</>
			)}
		</motion.div>
	);
}
