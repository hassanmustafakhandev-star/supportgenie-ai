"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, CheckCircle } from "lucide-react";

export const UploadPortal = () => {
    const [status, setStatus] = useState("idle"); // idle, scanning, complete

    const handleSimulatedUpload = () => {
        setStatus("scanning");
        setTimeout(() => setStatus("complete"), 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-[3rem] w-full max-w-4xl mx-auto border-t-2 border-t-electricViolet/30 relative">
            <h2 className="text-3xl font-mono text-digitalCyan mb-8 tracking-widest uppercase">Quantum Ingestion Portal</h2>

            <div
                onClick={status === "idle" ? handleSimulatedUpload : undefined}
                className={`w-64 h-64 rounded-full border-2 border-dashed flex items-center justify-center relative cursor-pointer overflow-hidden transition-all duration-500
          ${status === "idle" ? "border-electricViolet/50 hover:bg-electricViolet/10" : ""}
          ${status === "scanning" ? "border-digitalCyan shadow-[0_0_30px_#00f3ff]" : ""}
          ${status === "complete" ? "border-neonGreen shadow-[0_0_30px_#39ff14] bg-neonGreen/10" : ""}
        `}
            >
                {/* Rotating SVG Particle Ring */}
                <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" className="text-electricViolet/50" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 15" className="text-digitalCyan/50" />
                </svg>

                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="flex flex-col items-center text-electricViolet/80"
                        >
                            <UploadCloud className="w-16 h-16 mb-4" />
                            <p className="font-mono text-xs uppercase tracking-widest text-center">
                                Init Link Sequence<br />Drag & Drop Matrix
                            </p>
                        </motion.div>
                    )}

                    {status === "scanning" && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative flex items-center justify-center w-32 h-32"
                        >
                            <File className="w-20 h-20 text-digitalCyan" />
                            {/* Laser Scan Line */}
                            <div className="absolute left-0 w-full h-1 bg-digitalCyan shadow-[0_0_15px_#00f3ff] animate-scan z-10" />
                        </motion.div>
                    )}

                    {status === "complete" && (
                        <motion.div
                            key="complete"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                            className="flex flex-col items-center text-neonGreen"
                        >
                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0, scale: 3 }}
                                transition={{ duration: 1 }}
                                className="absolute w-20 h-20 bg-neonGreen rounded-full mix-blend-screen"
                            /> {/* Ripple digital ping */}
                            <CheckCircle className="w-20 h-20 mb-2 relative z-10 drop-shadow-[0_0_15px_#39ff14]" />
                            <p className="font-mono text-sm uppercase tracking-[0.2em] relative z-10 font-bold">Processed</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-12 text-center text-electricViolet/50 font-mono text-sm max-w-lg leading-relaxed">
                System active. Acceptable formats: Quantum PDF arrays, Neural Web endpoints, Encrypted TXT hashes. Maximum packet constraint: 4096 Teraflops.
            </div>
        </div>
    );
};
