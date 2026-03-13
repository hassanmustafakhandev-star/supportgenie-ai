"use client";

import { Save, Bot, Palette, Settings as SettingsIcon, Shield, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Parameters</h1>
                    <p className="text-muted-foreground mt-1">Configure your AI agent settings and appearance.</p>
                </div>
                <Button variant="gradient" className="gap-2 shrink-0">
                    <Save className="w-4 h-4" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-2xl h-auto">
                    <TabsTrigger value="general" className="rounded-xl py-2.5 text-slate-600 dark:text-slate-400 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                        <SettingsIcon className="w-4 h-4 mr-2" /> General
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-xl py-2.5 text-slate-600 dark:text-slate-400 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                        <Palette className="w-4 h-4 mr-2" /> Appearance
                    </TabsTrigger>
                    <TabsTrigger value="behavior" className="rounded-xl py-2.5 text-slate-600 dark:text-slate-400 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                        <Bot className="w-4 h-4 mr-2" /> Behavior
                    </TabsTrigger>
                    <TabsTrigger value="limits" className="rounded-xl py-2.5 text-slate-600 dark:text-slate-400 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                        <Sliders className="w-4 h-4 mr-2" /> Limits
                    </TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="mt-6 space-y-6">
                    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
                        <CardHeader>
                            <CardTitle>Basic Configuration</CardTitle>
                            <CardDescription>Manage your primary agent details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 max-w-md">
                                <Label htmlFor="agent-name">Agent Name</Label>
                                <Input id="agent-name" defaultValue="SalesGenie" className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="welcome">Welcome Message</Label>
                                <textarea
                                    id="welcome"
                                    className="w-full min-h-[100px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 custom-scrollbar resize-none"
                                    defaultValue="Hi there! I'm your virtual assistant. How can I help you regarding SupportGenie today?"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* APPEARANCE TAB */}
                <TabsContent value="appearance" className="mt-6 space-y-6">
                    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
                        <CardHeader>
                            <CardTitle>Widget Styling</CardTitle>
                            <CardDescription>Customize how the chat widget looks on your website.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label>Brand Color</Label>
                                    <div className="flex gap-4 items-center">
                                        <Input type="color" defaultValue="#8b5cf6" className="w-16 h-12 p-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer" />
                                        <Input defaultValue="#8b5cf6" className="w-32 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 uppercase" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Used for header and primary buttons.</p>
                                </div>

                                <div className="space-y-3">
                                    <Label>Widget Position</Label>
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Bottom Right</span>
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-500" />
                                        </button>
                                        <button className="flex-1 py-3 px-4 rounded-xl border border-purple-400 bg-purple-50 dark:bg-purple-500/10 transition-colors flex items-center justify-between">
                                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Bottom Left</span>
                                            <div className="w-4 h-4 rounded-full border-4 border-purple-500 bg-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Avatar Logo</Label>
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                                        <Bot className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-600 h-8 text-xs">Upload New</Button>
                                            <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10">Remove</Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Supported: JPG, PNG, SVG (Max 1MB)</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BEHAVIOR TAB */}
                <TabsContent value="behavior" className="mt-6 space-y-6">
                    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
                        <CardHeader>
                            <CardTitle>System Prompt / Rules</CardTitle>
                            <CardDescription>Tell the AI how it should behave and respond.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                className="w-full min-h-[250px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 custom-scrollbar resize-none"
                                defaultValue={`You are a helpful customer support agent for SupportGenie AI.
Always maintain a professional, courteous tone.
NEVER make up prices or features not included in your context.
If you do not know the answer to a question, politely say: 
"I'm sorry, but I don't have that specific information right now. Let me connect you with a human agent."

Key guidelines:
- Keep answers under 3 paragraphs unless asked for details.
- Use formatting (bolding) to emphasize important terms.
- Refuse to answer questions unrelated to the business.`}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* LIMITS TAB */}
                <TabsContent value="limits" className="mt-6 space-y-6">
                    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
                        <CardHeader>
                            <CardTitle>Rate Limits & Constraints</CardTitle>
                            <CardDescription>Control API usage and message caps to manage costs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="max-tokens">Max Response Length (Tokens)</Label>
                                <Input id="max-tokens" type="number" defaultValue="250" className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                                <p className="text-xs text-muted-foreground mt-1">~180 words maximum per answer.</p>
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label htmlFor="monthly-limit">Monthly Message Limit Per User</Label>
                                <Input id="monthly-limit" type="number" defaultValue="50" className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                                <p className="text-xs text-muted-foreground mt-1">Prevents abuse by blocking IPs after X messages.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
