"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart,
    Bot,
    MessageSquare,
    PlusCircle,
    Settings,
    CreditCard,
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Bots", href: "/dashboard/bots", icon: Bot },
    { name: "Create Bot", href: "/dashboard/create-bot", icon: PlusCircle },
    { name: "Chat Logs", href: "/dashboard/chat-logs", icon: MessageSquare },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hidden md:flex">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 dark:border-slate-700">
                <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    SupportGenie AI
                </span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-gradient-primary text-white shadow-md shadow-purple-500/20"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                                    isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            {/* Mini banner at the bottom of sidebar */}
            <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Pro Plan</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">3 / 5 Bots Used</p>
                <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary w-[60%]" />
                </div>
            </div>
        </div>
    );
}
