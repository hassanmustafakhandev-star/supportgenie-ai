"use client";

import { useEffect, useRef } from "react";

export const BackgroundMesh = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let animationId;
        let width, height;

        const stars = [];
        const STAR_COUNT = 250;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const initStars = () => {
            stars.length = 0;
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.2 + 0.3,
                    alpha: Math.random(),
                    speed: Math.random() * 0.003 + 0.001,
                    color: Math.random() > 0.6 ? "#00f3ff" : Math.random() > 0.5 ? "#8A2BE2" : "#ffffff",
                });
            }
        };

        resize();
        initStars();
        window.addEventListener("resize", () => { resize(); initStars(); });

        let tick = 0;
        const draw = () => {
            tick++;
            ctx.clearRect(0, 0, width, height);

            // Deep void background
            ctx.fillStyle = "#030303";
            ctx.fillRect(0, 0, width, height);

            // Teal radial glow
            const g1 = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);
            g1.addColorStop(0, "rgba(0,128,128,0.12)");
            g1.addColorStop(1, "transparent");
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, width, height);

            // Violet radial glow top-right
            const g2 = ctx.createRadialGradient(width * 0.8, height * 0.15, 0, width * 0.8, height * 0.15, width * 0.4);
            g2.addColorStop(0, "rgba(138,43,226,0.09)");
            g2.addColorStop(1, "transparent");
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, width, height);

            // Animated stars
            for (const star of stars) {
                star.alpha = 0.4 + 0.6 * Math.abs(Math.sin(tick * star.speed + star.x));

                ctx.save();
                ctx.globalAlpha = star.alpha;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.shadowColor = star.color;
                ctx.shadowBlur = star.color === "#ffffff" ? 2 : 8;
                ctx.fill();
                ctx.restore();
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[-1]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default BackgroundMesh;
