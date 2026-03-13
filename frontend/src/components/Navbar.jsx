"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">

            {/* Search Bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                        type="search"
                        className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10 rounded-full"
                        placeholder="Search bots, chats, or settings..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4 ml-auto">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gradient-primary border-2 border-transparent">
                            <User className="h-5 w-5 text-white" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mt-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal border-b border-slate-100 dark:border-slate-700 pb-2">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">{user?.displayName || "Admin User"}</p>
                                <p className="text-xs leading-none text-slate-500">{user?.email || "admin@supportgenie.ai"}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer mt-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300">
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300">
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300">
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700 my-2" />
                        <DropdownMenuItem 
                            onClick={handleLogout}
                            className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl focus:text-red-600"
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
