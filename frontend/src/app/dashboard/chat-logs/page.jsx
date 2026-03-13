import { useState, useEffect } from "react";
import { Search, Filter, MessageSquare, Bot, User, Clock, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { getBots, sendChatMessage, getChatHistory } from "@/lib/api"; // Note: actually need a get_all_chats endpoint or specific bot chats
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export default function ChatLogsPage() {
    const searchParams = useSearchParams();
    const botIdParam = searchParams.get("botId");
    
    const { user, loading: authLoading } = useAuth();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(botIdParam || "All Bots");
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (authLoading || !user) return;
            try {
                const token = await user.getIdToken();
                // If we have a specific bot filter, fetch its history
                // Otherwise, it's hard to fetch ALL chats across all bots without a dedicated endpoint
                // For now, let's assume we fetch for the filtered bot or show empty if none
                if (filter !== "All Bots") {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/${filter}/history`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setLogs(data.chats || []);
                }
            } catch (err) {
                console.error("Failed to fetch logs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [user, authLoading, filter]);

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return new Date(isoString).toLocaleString();
    };

    const filteredLogs = logs.filter(log =>
        (filter === "All Bots" || log.botId === filter) &&
        (log.id.toLowerCase().includes(search.toLowerCase()))
    );

    const [allBots, setAllBots] = useState([]);
    useEffect(() => {
        const fetchBots = async () => {
            if (!user) return;
            const token = await user.getIdToken();
            const res = await getBots(token);
            setAllBots(res.bots || []);
        };
        fetchBots();
    }, [user]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Chat Logs</h1>
                <p className="text-muted-foreground mt-1">Review conversations between your custom agents and users.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-sm">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by ID or Bot..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
                    />
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Filter className="w-4 h-4 mr-2" />
                                {filter}
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                            <DropdownMenuItem
                                onClick={() => setFilter("All Bots")}
                                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
                            >
                                All Bots
                            </DropdownMenuItem>
                            {allBots.map((b) => (
                                <DropdownMenuItem
                                    key={b.id}
                                    onClick={() => setFilter(b.id)}
                                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
                                >
                                    {b.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="secondary" className="w-full sm:w-auto shadow-sm">
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-2xl">Customer ID</th>
                                <th className="px-6 py-4">Agent Used</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4 text-center">Stats</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right rounded-tr-2xl">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                                        <p>Loading sessions...</p>
                                    </td>
                                </tr>
                            ) : filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-medium text-foreground">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <User className="w-3 h-3" />
                                            </div>
                                            {log.id.slice(-8)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/20">
                                                <Bot className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="font-medium text-purple-600 dark:text-purple-400">
                                                {allBots.find(b => b.id === log.botId)?.name || 'Bot'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground text-xs">
                                        {formatDate(log.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="flex items-center justify-center text-xs">
                                            <MessageSquare className="w-3 h-3 mr-1 text-blue-400" />
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
                                            Live
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs px-4 text-slate-700 dark:text-slate-300"
                                        >
                                            View Thread
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="text-lg font-medium">No chat logs found</p>
                                        <p className="text-sm">Try adjusting your search or filters.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 rounded-b-2xl">
                    <div>Showing <b>1</b> to <b>{filteredLogs.length}</b> of <b>{filteredLogs.length}</b> entries</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-600 h-8 text-xs pointer-events-none opacity-50">Previous</Button>
                        <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-600 h-8 text-xs pointer-events-none opacity-50">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
