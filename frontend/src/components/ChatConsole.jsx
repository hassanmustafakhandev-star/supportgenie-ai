"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, Link, Bot } from "lucide-react";
import gsap from "gsap";
import { sendChatMessage } from "@/lib/api";

const ScrambleText = ({ text }) => {
    const nodeRef = useRef(null);

    useEffect(() => {
        if (!text) return;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let iterations = 0;
        const interval = setInterval(() => {
            if (nodeRef.current) {
                nodeRef.current.innerText = text
                    .split("")
                    .map((letter, index) => {
                        if (index < iterations) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");

                if (iterations >= text.length) clearInterval(interval);
                iterations += 1 / 3;
            }
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span ref={nodeRef} className="font-mono tracking-wide text-digitalCyan drop-shadow-[0_0_5px_#00f3ff]">{text}</span>;
};

export const ChatConsole = ({ botId, botName = "SupportGenie Agent" }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: `${botName} initialized. Knowledge array bound. Awaiting input query...`, isTyping: false }
    ]);
    const [input, setInput] = useState("");
    const [chatId, setChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !botId || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        // Add a placeholder for AI response
        setMessages(prev => [...prev, { role: 'ai', content: "", isTyping: true }]);

        try {
            const response = await sendChatMessage(botId, userMsg, chatId);
            
            if (response.chatId) setChatId(response.chatId);

            setMessages(prev => {
                const newMessages = [...prev];
                const lastIdx = newMessages.length - 1;
                newMessages[lastIdx] = { 
                    role: 'ai', 
                    content: response.answer || "I'm' sorry, I couldn't process that request.", 
                    isTyping: false,
                    source: response.source || null
                };
                return newMessages;
            });
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastIdx = newMessages.length - 1;
                newMessages[lastIdx] = { 
                    role: 'ai', 
                    content: "System Error: Connection to backend lost. Please try again.", 
                    isTyping: false 
                };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-[600px] w-full glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative bg-slate-900/40">
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/60 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-mono text-digitalCyan tracking-widest text-xs uppercase">{botName}</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500/80 font-mono uppercase tracking-tighter">System Live</span>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 z-10 relative custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                                ${msg.role === 'user'
                                    ? 'bg-purple-600/20 border border-purple-500/30 text-white rounded-tr-none'
                                    : 'bg-slate-800/80 border border-white/10 text-slate-100 rounded-tl-none'
                                }`}
                            >
                                {msg.isTyping ? (
                                    <div className="flex gap-1.5 py-1">
                                        <div className="w-1.5 h-1.5 bg-digitalCyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-digitalCyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-digitalCyan rounded-full animate-bounce" />
                                    </div>
                                ) : (
                                    <div className="font-sans">
                                        {msg.content}
                                    </div>
                                )}
                            </div>

                            {msg.source && (
                                <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5 mx-2">
                                    <Link className="w-3 h-3 text-digitalCyan" />
                                    <span className="text-[10px] font-mono text-slate-500">Source: {msg.source}</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-slate-900/60 border-t border-white/10 z-10">
                <div className="relative flex items-center">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="w-full bg-white/5 border border-white/10 text-white text-sm px-5 py-3 rounded-xl outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-gradient-primary text-white rounded-lg transition-transform active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
