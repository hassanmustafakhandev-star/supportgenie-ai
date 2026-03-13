"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, MessageSquare, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { sendChatMessage } from "@/lib/api";

export function ChatWidget({
    title = "SupportGenie AI",
    welcomeMessage = "Hi there! How can I help you today?",
    botId,
    position = "right",
    color = "blue"
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([
        { id: 1, role: "bot", content: welcomeMessage }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        const msgText = input.trim();
        if (!msgText) return;

        const userMsg = { id: Date.now(), role: "user", content: msgText };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            if (!botId) {
                throw new Error("No bot ID provided to widget configuration.");
            }
            
            // Call the real backend endpoint
            const response = await sendChatMessage(botId, msgText, chatId);
            
            // Save the session ID to keep conversation history
            if (response.chatId && !chatId) {
                setChatId(response.chatId);
            }

            const botMsg = {
                id: Date.now() + 1,
                role: "bot",
                content: response.answer || "Sorry, I couldn't generate a response.",
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                role: "bot",
                content: "Error: Could not connect to the agent. " + (error.message || ""),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickReply = (text) => {
        setInput(text);
        // We could also auto-send the reply by extracting the send logic, 
        // but populating the input is fine for now.
    };

    const quickReplies = ["Pricing", "Features", "Talk to Sales"];

    useEffect(() => {
        // Notify parent of state change for iframe resizing
        if (window !== window.parent) {
            window.parent.postMessage({
                type: 'GENIE_WIDGET_STATE',
                isOpen,
            }, '*');
        }
    }, [isOpen]);

    return (
        <div
            className={cn(
                "fixed bottom-6 z-50 flex flex-col items-end space-y-4",
                position === "left" ? "left-6 items-start" : "right-6 items-end"
            )}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-80 sm:w-96 overflow-hidden rounded-2xl glass-panel shadow-2xl flex flex-col"
                        style={{ height: "500px" }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-primary p-4 flex justify-between items-center text-white">
                            <div className="flex items-center space-x-2">
                                <Bot className="w-5 h-5 text-digitalCyan" />
                                <span className="font-semibold">{title}</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/40">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex w-full items-start space-x-2",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {msg.role === "bot" && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            "px-4 py-2 rounded-2xl max-w-[80%] text-sm",
                                            msg.role === "user"
                                                ? "bg-gradient-primary text-white rounded-tr-none"
                                                : "bg-white/10 text-white rounded-tl-none border border-white/10"
                                        )}
                                    >
                                        {msg.content}
                                    </div>

                                    {msg.role === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex w-full items-start space-x-2 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white/10 rounded-tl-none flex space-x-1.5 items-center">
                                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        {messages.length === 1 && !isTyping && (
                            <div className="p-3 bg-black/60 flex flex-wrap gap-2 border-t border-white/10">
                                {quickReplies.map((reply) => (
                                    <button
                                        key={reply}
                                        onClick={() => handleQuickReply(reply)}
                                        className="text-xs px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <form
                            onSubmit={handleSend}
                            className="p-3 bg-black/60 border-t border-white/10 flex items-center space-x-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-purple-500 rounded-full h-10 px-4"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim()}
                                variant="gradient"
                                className="h-10 w-10 rounded-full flex-shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-gradient-primary shadow-lg shadow-purple-500/30 flex items-center justify-center text-white focus:outline-none"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
