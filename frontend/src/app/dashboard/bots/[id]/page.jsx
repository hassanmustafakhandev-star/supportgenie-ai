"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bot, ChevronLeft, Settings, MessageSquare, Code, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatConsole } from "@/components/ChatConsole";
import { getBot, getAuthToken } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function BotPlaygroundPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [bot, setBot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBotData = async () => {
            if (!user || !id) return;
            try {
                const token = await user.getIdToken();
                const data = await getBot(id, token);
                setBot(data);
            } catch (err) {
                console.error("Error fetching bot:", err);
                setError("Failed to load agent details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBotData();
    }, [id, user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error || !bot) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-destructive">{error || "Agent not found"}</h3>
                <Button variant="link" onClick={() => router.push("/dashboard/bots")}>
                    Back to My Agents
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.push("/dashboard/bots")}
                        className="rounded-full hover:bg-white/10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            {bot.name}
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-normal">
                                {bot.status || 'Active'}
                            </span>
                        </h1>
                        <p className="text-muted-foreground mt-1">Playground & Configuration</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="glass-panel border-white/10">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                    <Button variant="gradient" onClick={() => router.push("/dashboard/analytics")}>
                        <Info className="w-4 h-4 mr-2" />
                        Analytics
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Chat Playground */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Live Playground
                        </h3>
                    </div>
                    <ChatConsole botId={id} botName={bot.name} />
                </div>

                {/* Agent Details & Embed */}
                <div className="space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Knowledge Base
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DocumentList botId={id} />
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Code className="w-4 h-4" />
                                Deployment Snippet
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground">
                                Paste this script into your website's HTML to activate the widget.
                            </p>
                            <div className="relative bg-black/40 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-blue-300 overflow-x-auto">
                                <pre>
{`<!-- SupportGenie AI -->
<script 
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget/widget.v1.js" 
  data-agent-id="${id}"
  data-theme="dark"
  defer>
</script>`}
                                </pre>
                            </div>
                            <Button 
                                className="w-full bg-white/10 hover:bg-white/20 text-white border-white/10" 
                                variant="outline"
                                onClick={() => {
                                    const code = `<!-- SupportGenie AI -->
<script src="${window.location.origin}/widget/widget.v1.js" data-agent-id="${id}" data-theme="dark" defer></script>`;
                                    navigator.clipboard.writeText(code);
                                }}
                            >
                                <Code className="w-4 h-4 mr-2" />
                                Copy Code
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                Agent Metadata
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-xs text-muted-foreground">Business Name</span>
                                <span className="text-sm font-medium">{bot.businessName}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-xs text-muted-foreground">Tone Profile</span>
                                <span className="text-sm font-medium capitalize">{bot.tone}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs text-muted-foreground">Created On</span>
                                <span className="text-sm font-medium">
                                    {bot.createdAt ? new Date(bot.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DocumentList({ botId }) {
    const { user } = useAuth();
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const res = await getBotDocuments(botId, token);
                setDocs(res.documents || []);
            } catch (err) {
                console.error("Docs fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, [botId, user]);

    const handleDelete = async (docId) => {
        const token = await user.getIdToken();
        await deleteBotDocument(botId, docId, token);
        setDocs(docs.filter(d => d.id !== docId));
    };

    if (loading) return <div className="text-xs text-muted-foreground animate-pulse">Scanning records...</div>;

    return (
        <div className="space-y-3">
            {docs.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No training data linked.</p>
            ) : docs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 group">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="text-[10px] p-1 bg-purple-500/20 text-purple-400 rounded uppercase font-mono shrinkage-0">
                            {doc.type}
                        </div>
                        <span className="text-xs font-medium truncate text-slate-300">{doc.fileName}</span>
                    </div>
                    <button 
                        onClick={() => handleDelete(doc.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-500 transition-all"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
    );
}
