"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, ArrowRight, Check, Play, MessageSquare, Zap, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const features = [
        {
            title: "24/7 Automated Support",
            description: "Never miss a customer query. Your AI agent works round the clock to resolve issues instantly.",
            icon: Clock,
        },
        {
            title: "Trained on Your Data",
            description: "Upload PDFs, manuals, or simply enter your website URL. The AI learns everything about your business.",
            icon: Database,
        },
        {
            title: "Easy Embed Script",
            description: "Deployment is as simple as copying and pasting a single line of code into your website's footer.",
            icon: Code,
        },
        {
            title: "Analytics Dashboard",
            description: "Track performance, view common questions, and see how much time your AI agent is saving you.",
            icon: BarChart,
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Subtle Background Gradient */}
            <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

            {/* Header */}
            <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
                <Link className="flex items-center justify-center" href="/">
                    <Bot className="h-8 w-8 text-purple-600 mr-2" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        SupportGenie
                    </span>
                </Link>
                <nav className="hidden md:flex gap-8 sm:gap-10">
                    <Link className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" href="#how-it-works">
                        How It Works
                    </Link>
                    <Link className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" href="#features">
                        Features
                    </Link>
                    <Link className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" href="#pricing">
                        Pricing
                    </Link>
                    <Link className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" href="#faq">
                        FAQ
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hidden sm:block text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors">
                        Sign In
                    </Link>
                    <Link href="/signup">
                        <Button variant="gradient" className="rounded-full px-6">Get Started</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-20 md:py-32 lg:py-40 flex justify-center text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/40 dark:bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-200/40 dark:bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
                            <div className="inline-flex items-center rounded-full border border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-400 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 mr-2" />
                                SupportGenie AI 2.0 is now live
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight text-slate-900 dark:text-white">
                                Create Your AI Customer <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    Support Agent in Minutes
                                </span>
                            </h1>

                            <p className="max-w-[700px] text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                                Upload your business data, PDFs, or website link.
                                We'll generate a custom AI chatbot trained exclusively on your content, ready to deploy instantly.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
                                <Link href="/signup">
                                    <Button variant="gradient" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full group">
                                        Start Free Trial
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => setIsVideoOpen(true)}
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <Play className="mr-2 h-5 w-5 fill-current" />
                                    View Demo
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="w-full py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-white/10 relative">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">How It Works</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-[600px] mx-auto">
                                Go from raw data to an intelligent support agent in three simple steps.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            <div className="hidden md:block absolute top-[120px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-blue-200 via-purple-300 to-blue-200 dark:from-blue-500/20 dark:via-purple-500/50 dark:to-blue-500/20" />

                            {[
                                {
                                    step: "01",
                                    title: "Upload Your Business Data",
                                    desc: "Drag and drop PDFs, documents, or simply provide your website URL.",
                                    icon: Database
                                },
                                {
                                    step: "02",
                                    title: "AI Trains on Your Data",
                                    desc: "Our neural engine processes your content and creates an intelligent semantic map.",
                                    icon: Bot
                                },
                                {
                                    step: "03",
                                    title: "Embed Chatbot on Website",
                                    desc: "Copy a single line of JavaScript to your website to go live instantly.",
                                    icon: Code
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center relative z-10 group">
                                    <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-purple-400 transition-all duration-300 relative">
                                        <item.icon className="w-10 h-10 text-purple-600 dark:text-purple-400 relative z-10 group-hover:text-purple-500 transition-colors" />
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-primary text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-24">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Powerful Features</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-[600px] mx-auto">
                                Everything you need to automate customer support gracefully.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            {features.map((feature, i) => (
                                <Card key={i} className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500/30 transition-colors group shadow-sm hover:shadow-md">
                                    <CardContent className="p-8 flex items-start gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-gradient-primary transition-colors duration-300">
                                            <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="w-full py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-white/10">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-[600px] mx-auto">
                                No hidden fees. Scale your support as your business grows.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Free Plan */}
                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 flex flex-col pt-8 shadow-sm">
                                <CardContent className="flex-1 p-8 pt-0">
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Free Plan</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-5xl font-bold text-slate-900 dark:text-white">$0</span>
                                        <span className="text-slate-500">/ forever</span>
                                    </div>
                                    <ul className="space-y-4 mb-8">
                                        {["1 AI Agent", "100 messages/month", "Basic Document Parsing", "Community Support"].map((f, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                                <span className="text-slate-600 dark:text-slate-400">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/signup" className="mt-auto block">
                                        <Button variant="outline" className="w-full h-12 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Get Started</Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Pro Plan */}
                            <Card className="bg-white dark:bg-slate-800/50 border-purple-400 dark:border-purple-500/50 shadow-xl shadow-purple-500/10 flex flex-col relative transform md:-translate-y-4">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                    MOST POPULAR
                                </div>
                                <CardContent className="flex-1 p-8 pt-10 relative z-10">
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Pro Plan</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-5xl font-bold text-slate-900 dark:text-white">$49</span>
                                        <span className="text-slate-500">/ month</span>
                                    </div>
                                    <ul className="space-y-4 mb-8">
                                        {["5 AI Agents", "5,000 messages/month", "Advanced Website Crawling", "Remove Branding", "Priority Email Support"].map((f, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-200 font-medium">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/signup" className="mt-auto block">
                                        <Button variant="gradient" className="w-full h-12 text-lg">Start Free Trial</Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Enterprise Plan */}
                            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 flex flex-col pt-8 shadow-sm">
                                <CardContent className="flex-1 p-8 pt-0">
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Enterprise Plan</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-5xl font-bold text-slate-900 dark:text-white">$199</span>
                                        <span className="text-slate-500">/ month</span>
                                    </div>
                                    <ul className="space-y-4 mb-8">
                                        {["Unlimited Agents", "50,000 messages/month", "Custom Integrations", "Dedicated Account Manager", "24/7 Phone Support"].map((f, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                                <span className="text-slate-600 dark:text-slate-400">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/signup" className="mt-auto block">
                                        <Button variant="outline" className="w-full h-12 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Contact Sales</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="w-full py-24">
                    <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need to know about SupportGenie AI.</p>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {[
                                {
                                    q: "How does the AI train on my data?",
                                    a: "When you upload a PDF or provide a URL, our system breaks down the text into semantic vectors. When a user asks a question, the AI retrieves the most relevant vectors from your data and formulates an accurate answer based exclusively on that information."
                                },
                                {
                                    q: "Do I need coding skills to use SupportGenie?",
                                    a: "Not at all. The entire dashboard is no-code. To add the agent to your site, you just copy and paste a single HTML script tag into your website's header or footer, similar to adding Google Analytics."
                                },
                                {
                                    q: "What happens if the AI doesn't know the answer?",
                                    a: "You can configure a fallback response in the Settings. Typically, the AI will politely admit it doesn't know the answer and offer to collect the user's email so a human agent can follow up with them later."
                                },
                                {
                                    q: "Is my business data secure?",
                                    a: "Yes. Your data is encrypted at rest and in transit. We do not use your proprietary business data to train external public models. Your data belongs to you and is strictly used to power your specific AI agent."
                                }
                            ].map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 shadow-sm">
                                    <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline hover:text-purple-600 dark:hover:text-purple-400 text-slate-900 dark:text-white">{faq.q}</AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-400 text-base pb-6 leading-relaxed">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-24 relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
                    <div className="container px-4 md:px-6 relative z-10 text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 mt-12 text-white">Ready to automate your customer support?</h2>
                        <p className="text-xl text-white/80 mb-10">
                            Join thousands of businesses saving time and money with SupportGenie AI.
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-white text-purple-700 hover:bg-slate-100 border-0 shadow-xl font-bold">
                                Get Started for Free
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 px-6 lg:px-14 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Bot className="h-6 w-6 text-purple-600" />
                        <span className="text-lg font-bold text-slate-900 dark:text-white">SupportGenie AI</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        © 2024 SupportGenie AI Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="#">
                            Terms
                        </Link>
                        <Link className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="#">
                            Privacy
                        </Link>
                        <div className="flex gap-4">
                            <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 hover:bg-purple-500 cursor-pointer transition-colors" />
                            <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 hover:bg-purple-500 cursor-pointer transition-colors" />
                            <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 hover:bg-purple-500 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Icons
const Clock = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)
const Database = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
)
const Code = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
)
const Sparkles = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
)
