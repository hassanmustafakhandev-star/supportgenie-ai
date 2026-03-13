"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CursorFollower = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('button, a, input, [role="button"], .interactive, .cursor-hover')) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
            animate={{
                x: mousePosition.x - (isHovered ? 32 : 12),
                y: mousePosition.y - (isHovered ? 32 : 12),
                width: isHovered ? 64 : 24,
                height: isHovered ? 64 : 24,
            }}
            transition={{ type: "spring", mass: 0.1, stiffness: 200, damping: 15 }}
        >
            <div className={`w-full h-full rounded-full transition-colors duration-300 ${isHovered ? 'bg-digitalCyan/20 border-2 border-digitalCyan shadow-[0_0_20px_#00f3ff]' : 'bg-electricViolet/10 border border-electricViolet/50 shadow-[0_0_10px_#8A2BE2]'}`} />
        </motion.div>
    );
};
