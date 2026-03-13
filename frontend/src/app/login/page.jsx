"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to sign in");
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            await signInWithPopup(auth, googleProvider);
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to sign in with Google");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

            <Card className="w-full max-w-md glass-panel border border-white/10 dark:border-white/5 relative z-10 shadow-2xl">
                <CardHeader className="space-y-2 text-center pb-6">
                    <div className="mx-auto bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your email to sign in to your AI Support account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    placeholder="m@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-purple-500 hover:text-purple-400"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10"
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                        <Button
                            className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02]"
                            type="submit"
                            disabled={isLoading}
                            variant="gradient"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background/50 px-2 text-muted-foreground backdrop-blur-sm rounded-full">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full h-12 border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 space-x-2"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                            <path
                                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                fill="#EA4335"
                            />
                            <path
                                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                fill="#4285F4"
                            />
                            <path
                                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                fill="#34A853"
                            />
                        </svg>
                        <span>Google</span>
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-purple-500 hover:text-purple-400 font-semibold">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
