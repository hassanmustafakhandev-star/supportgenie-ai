"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Clock, Zap, Target, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAnalytics } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AnalyticsPage() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({ messageCount: 0, tokenUsage: 0, totalBots: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (authLoading) return;
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const token = await user.getIdToken();
                const data = await getAnalytics(token);
                setStats(data);
            } catch (err) {
                console.error("Failed to load analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, authLoading]);

    const metrics = [
        {
            title: "Total Queries",
            value: loading ? "..." : (stats.messageCount || 0).toLocaleString(),
            change: "+12.5%",
            icon: MessageSquare,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Active Agents",
            value: loading ? "..." : (stats.totalBots || 0).toString(),
            change: "+1",
            icon: Bot,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Success Rate",
            value: "98.2%",
            change: "+2.4%",
            icon: Target,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Tokens Used",
            value: loading ? "..." : (stats.tokenUsage || 0).toLocaleString(),
            change: "+150k",
            icon: Zap,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        }
    ];

    const topQuestions = [
        { question: "What is your refund policy?", count: 1245, pct: 18 },
        { question: "How do I upgrade my plan?", count: 832, pct: 12 },
        { question: "Do you offer API access?", count: 541, pct: 8 },
        { question: "Is there a free trial?", count: 420, pct: 6 },
        { question: "How to reset password?", count: 310, pct: 4 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">Deep dive into your AI agents' performance.</p>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <Card key={metric.title} className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <metric.icon className={`w-16 h-16 ${metric.color}`} />
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center`}>
                                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${metric.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'
                                    }`}>
                                    {metric.change}
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                            <p className="text-3xl font-bold mt-1">{metric.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Mock Area Chart */}
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
                    <CardHeader>
                        <CardTitle>Usage Volume</CardTitle>
                        <CardDescription>Queries processed over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full relative flex items-end">
                            {/* Fake grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-slate-200 dark:bg-slate-600" />
                                ))}
                            </div>

                            {/* Mock SVG Graph */}
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,100 L0,60 Q10,40 20,55 T40,30 T60,50 T80,20 T100,10 L100,100 Z"
                                    fill="url(#gradient)"
                                />
                                <path
                                    d="M0,60 Q10,40 20,55 T40,30 T60,50 T80,20 T100,10"
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>
                    </CardContent>
                </Card>

                {/* Mock Donut Chart / Top Questions */}
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
                    <CardHeader>
                        <CardTitle>Most Asked Questions</CardTitle>
                        <CardDescription>What users are asking your agents</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topQuestions.map((q, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-foreground">{q.question}</span>
                                        <span className="text-muted-foreground">{q.count} ({q.pct}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${i === 0 ? 'bg-purple-500' :
                                                i === 1 ? 'bg-blue-500' :
                                                    i === 2 ? 'bg-emerald-500' :
                                                        i === 3 ? 'bg-orange-500' :
                                                            'bg-pink-500'
                                                }`}
                                            style={{ width: `${q.pct * 3}%` }} // Multiply to make bars visible in demo
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
