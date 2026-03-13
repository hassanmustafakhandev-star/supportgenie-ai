"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Bot, MoreVertical, Edit, MessageSquare, Trash2, Code, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBots, deleteBot } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function MyBotsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBots = async () => {
            if (authLoading) return;
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const token = await user.getIdToken();
                const data = await getBots(token);
                setBots(data.bots || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBots();
    }, [user, authLoading]);

    const handleDelete = async (botId) => {
        if (!confirm("Are you sure you want to delete this bot?")) return;
        try {
            const token = await user.getIdToken();
            await deleteBot(botId, token);
            setBots(bots.filter((b) => b.id !== botId));
        } catch (err) {
            alert("Failed to delete bot: " + err.message);
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return new Date(isoString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-muted-foreground">Loading your bots...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-lg">Error loading bots: {error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Bots</h1>
                    <p className="text-muted-foreground mt-1">Manage and deploy your custom AI agents.</p>
                </div>
                <Link href="/dashboard/create-bot">
                    <Button variant="gradient" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create New Bot
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bots.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Bot className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No bots found</h3>
                        <p className="text-muted-foreground mb-4">You haven't created any AI agents yet.</p>
                        <Link href="/dashboard/create-bot">
                            <Button variant="gradient">Create Your First Bot</Button>
                        </Link>
                    </div>
                ) : bots.map((bot) => (
                    <Card key={bot.id} className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 overflow-hidden group shadow-sm relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />

                        <CardHeader className="flex flex-row items-start justify-between pb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{bot.name}</h3>
                                    <div className="flex items-center mt-1">
                                        <span className={`w-2 h-2 rounded-full mr-2 ${bot.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]'
                                            : 'bg-yellow-500 animate-pulse'
                                            }`} />
                                        <span className="text-xs text-muted-foreground">{bot.status || 'Active'}</span>
                                    </div>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -m-2 opacity-50 hover:opacity-100">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                                    <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg py-2 text-slate-700 dark:text-slate-300">
                                        <Edit className="mr-2 h-4 w-4" /> Edit Configuration
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg py-2 text-slate-700 dark:text-slate-300">
                                        <MessageSquare className="mr-2 h-4 w-4" /> View Chats
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg py-2 text-blue-600 dark:text-blue-400 focus:text-blue-600">
                                        <Code className="mr-2 h-4 w-4" /> Get Embed Code
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(bot.id)} className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg py-2 mt-1">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Bot
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Total Messages</p>
                                    <p className="text-xl font-semibold">{bot.messages || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Created At</p>
                                    <p className="text-sm font-medium pt-1">{formatDate(bot.createdAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 dark:bg-slate-800/80 pt-4 pb-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="w-full flex space-x-2">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 text-xs h-9 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => router.push(`/dashboard/chat-logs?botId=${bot.id}`)}
                                >
                                    <MessageSquare className="w-3 h-3 mr-2" />
                                    View Logs
                                </Button>
                                <Button 
                                    variant="gradient" 
                                    className="flex-1 text-xs h-9"
                                    onClick={() => router.push(`/dashboard/bots/${bot.id}`)}
                                >
                                    <Code className="w-3 h-3 mr-2" />
                                    Test & Embed
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
