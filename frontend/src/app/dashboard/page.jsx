"use client";

import { useState, useEffect } from "react";
import { Activity, Bot, MessageSquare, Zap, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalytics, getBots } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function DashboardOverview() {
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (authLoading) return;
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const token = await user.getIdToken();
                
                // 1. Fetch Analytics
                const analytics = await getAnalytics(token);
                setData(analytics);

                // 2. Fetch Recent Activity (from first bot for now)
                const botsRes = await getBots(token);
                const bots = botsRes.bots || [];
                
                if (bots.length > 0) {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/${bots[0].id}/history`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const chatLogs = await res.json();
                    setActivity(chatLogs.chats?.slice(0, 5).map(c => ({
                        id: c.id,
                        bot: bots[0].name,
                        action: "Customer Interaction",
                        time: new Date(c.createdAt).toLocaleTimeString(),
                        status: "success"
                    })) || []);
                } else {
                    setActivity([{ id: 'welcome', bot: "System", action: "Create your first bot!", time: "Now", status: "info" }]);
                }
            } catch (err) {
                console.error("Dashboard fetch failed", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user, authLoading]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Bots",
            value: data?.totalBots || "0",
            icon: Bot,
            description: "Active AI agents",
            trend: "Real-time"
        },
        {
            title: "Total Messages",
            value: data?.messageCount || "0",
            icon: MessageSquare,
            description: "This month",
            trend: "Live"
        },
        {
            title: "Token Usage",
            value: data?.tokenUsage || "0",
            icon: Activity,
            description: "Tokens consumed",
            trend: "Monthly"
        },
        {
            title: "Current Plan",
            value: "Free",
            icon: Zap,
            description: "Basic Tier",
            trend: "Active"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening with your AI agents today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 relative overflow-hidden group shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors duration-500" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                <stat.icon className="h-4 w-4 text-purple-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center mt-1 space-x-2">
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                                <span className="flex items-center text-xs text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                    {stat.trend}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
                    <CardHeader>
                        <CardTitle>Messages Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                        <div className="h-[300px] w-full flex items-end justify-between px-4 pb-4 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-80">
                            {[40, 70, 45, 90, 65, 85, 120].map((height, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-12 bg-gradient-primary rounded-t-md opacity-70 group-hover:opacity-100 transition-opacity"
                                        style={{ height: `${height}px` }}
                                    />
                                    <span className="text-xs text-muted-foreground">Day {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {activity.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No recent activity detected.</p>
                            ) : activity.map((item) => (
                                <div key={item.id} className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-4 ${item.status === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.bot}</p>
                                        <p className="text-sm text-muted-foreground">{item.action}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{item.time}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
