"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBot, uploadPDF, uploadWebsite, uploadFAQ } from "@/lib/api";
import { Bot, Check, ChevronRight, UploadCloud, Link as LinkIcon, FileText, Loader2, Copy, Code, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export default function CreateBotPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [embedCopied, setEmbedCopied] = useState(false);
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [botId, setBotId] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        botName: "",
        businessName: "",
        tone: "professional",
        websiteUrl: "",
        faqData: ""
    });

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const startTraining = async () => {
        if (step !== 2) return;
        setIsTraining(true);
        setError("");
        setStep(3);
        setTrainingProgress(10);

        try {
            console.log("startTraining triggered. User state:", !!user);
            if (!user) throw new Error("You must be logged in to create a bot.");
            
            const token = await user.getIdToken();
            console.log("Token retrieved successfully:", !!token);
            
            if (!token) throw new Error("Could not retrieve authentication token from Firebase.");

            // 1. Create Bot First
            const botRes = await createBot({
                name: formData.botName || "My Custom Agent",
                businessName: formData.businessName || "My Business",
                tone: formData.tone || "professional",
            }, token);
            const newBotId = botRes.id;
            setBotId(newBotId);
            setTrainingProgress(40);

            // 2. Upload Selected Data Sources in Parallel
            const uploadPromises = [];
            if (selectedFile) {
                uploadPromises.push(uploadPDF(newBotId, selectedFile, token));
            }
            if (formData.websiteUrl.trim()) {
                uploadPromises.push(uploadWebsite(newBotId, formData.websiteUrl.trim(), token));
            }
            if (formData.faqData.trim()) {
                uploadPromises.push(uploadFAQ(newBotId, formData.faqData.trim(), token));
            }

            if (uploadPromises.length > 0) {
                await Promise.all(uploadPromises);
            }
            setTrainingProgress(100);

            setTimeout(() => {
                setIsTraining(false);
                setStep(4);
            }, 600);

        } catch (err) {
            console.error("Training Error:", err);
            setError(err.message || "Failed to start training.");
            setIsTraining(false);
            setStep(2);
        }
    };

    const copyEmbedCode = () => {
        const code = `<!-- SupportGenie AI Widget -->
<script 
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget/widget.v1.js" 
  data-agent-id="${botId}"
  data-theme="dark"
  defer>
</script>`;
        navigator.clipboard.writeText(code);
        setEmbedCopied(true);
        setTimeout(() => setEmbedCopied(false), 2000);
    };

    // Steps indicator component
    const StepsIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s, i) => (
                <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === s ? "bg-gradient-primary text-white shadow-lg shadow-purple-500/30" :
                            step > s ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" :
                                "bg-white/5 text-muted-foreground border border-white/10"
                        }`}>
                        {step > s ? <Check className="w-4 h-4" /> : s}
                    </div>
                    {i < 3 && (
                        <div className={`w-12 h-[2px] mx-2 ${step > s ? "bg-emerald-500/50" : "bg-white/10"
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Agent</h1>
                <p className="text-muted-foreground">Train a custom AI support agent on your business data.</p>
            </div>

            <StepsIndicator />

            <Card className="glass-panel border-white/10 dark:border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-10 pointer-events-none" />

                {/* STEP 1: Basic Information */}
                {step === 1 && (
                    <>
                        <CardHeader>
                            <CardTitle>Basic Details</CardTitle>
                            <CardDescription>Give your agent a name and defined personality.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="botName">Agent Name</Label>
                                <Input
                                    id="botName"
                                    placeholder="e.g. SalesGenie"
                                    value={formData.botName}
                                    onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input
                                    id="businessName"
                                    placeholder="Your Company Inc."
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label>Agent Tone</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Friendly', 'Professional', 'Casual'].map((tone) => (
                                        <div
                                            key={tone}
                                            onClick={() => setFormData({ ...formData, tone: tone.toLowerCase() })}
                                            className={`cursor-pointer border rounded-2xl p-4 text-center transition-all ${formData.tone === tone.toLowerCase()
                                                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                                }`}
                                        >
                                            <span className="font-medium">{tone}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-white/5 pt-6 mt-6">
                            <Button variant="ghost" className="opacity-0 cursor-default" disabled>Back</Button>
                            <Button onClick={handleNext} variant="gradient" className="gap-2">
                                Next Step <ChevronRight className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </>
                )}

                {/* STEP 2: Data Sources */}
                {step === 2 && (
                    <>
                        <CardHeader>
                            <CardTitle>Knowledge Sources</CardTitle>
                            <CardDescription>Upload data for your AI to train on.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* PDF Upload */}
                                <div 
                                    className="border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer group relative"
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                        <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-purple-400" />
                                    </div>
                                    <h3 className="font-medium text-lg mb-1">{selectedFile ? selectedFile.name : "Upload PDF"}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{selectedFile ? "File Selected" : "Manuals, guides, or policies"}</p>
                                    <Button variant="outline" size="sm" className="glass-panel border-white/20 rounded-full h-8 px-6 text-xs pointer-events-none">
                                        {selectedFile ? "Change File" : "Select File"}
                                    </Button>
                                    <Input 
                                        id="file-upload" 
                                        type="file" 
                                        accept=".pdf" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                                        }} 
                                    />
                                </div>

                                {/* Website URL */}
                                <div className="border border-white/10 rounded-2xl p-6 bg-white/5 flex flex-col justify-center space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                            <LinkIcon className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Crawl Website</h3>
                                            <p className="text-xs text-muted-foreground">Train on your public pages</p>
                                        </div>
                                    </div>
                                    <Input
                                        placeholder="https://yourwebsite.com"
                                        value={formData.websiteUrl}
                                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                        className="bg-black/20 border-white/10"
                                    />
                                    <Button variant="secondary" size="sm" className="w-full text-xs h-8">Fetch Pages</Button>
                                </div>
                            </div>

                            {/* Raw Text / FAQ */}
                            <div className="space-y-2 pt-2">
                                <Label className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    Direct Knowledge Input (FAQs, QA pairs)
                                </Label>
                                <textarea
                                    className="w-full min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 custom-scrollbar resize-none"
                                    placeholder="Q: What are your hours?&#10;A: We are open 9am to 5pm EST Monday through Friday."
                                    value={formData.faqData}
                                    onChange={(e) => setFormData({ ...formData, faqData: e.target.value })}
                                />
                            </div>
                            {error && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-white/5 pt-6 mt-6">
                            <Button onClick={handleBack} variant="ghost">Back</Button>
                            <Button 
                                onClick={startTraining} 
                                variant="gradient" 
                                className="gap-2"
                                disabled={!selectedFile && !formData.websiteUrl.trim() && !formData.faqData.trim()}
                            >
                                Begin Training <Bot className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </>
                )}

                {/* STEP 3: Training Progress */}
                {step === 3 && (
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center min-h-[400px]">
                        <div className="relative mb-8">
                            {/* Outer glowing rings */}
                            <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                            <div className="absolute inset-[-10px] rounded-full border border-blue-500/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

                            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                                <Bot className="w-12 h-12 text-white animate-breathe" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Training Neural Pathways</h2>
                        <p className="text-muted-foreground mb-8">Analyzing uploaded data and tuning responses...</p>

                        <div className="w-full max-w-md space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-400 font-medium">Processing chunks</span>
                                <span className="font-mono">{trainingProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full bg-gradient-primary transition-all duration-300 ease-out"
                                    style={{ width: `${trainingProgress}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                )}

                {/* STEP 4: Success & Embed */}
                {step === 4 && (
                    <CardContent className="py-10">
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                                <Check className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Agent Successfully Deployed!</h2>
                            <p className="text-muted-foreground">"{formData.botName || 'SalesGenie'}" is ready to handle customer queries.</p>
                        </div>

                        <div className="grid md:grid-cols-5 gap-8">
                            <div className="md:col-span-3 space-y-6">
                                <div>
                                    <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                                        <Code className="w-5 h-5 text-purple-500" />
                                        Integration Code
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Copy and paste this snippet just before the closing <code>&lt;/body&gt;</code> tag on your website.
                                    </p>

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                                        <div className="relative bg-black rounded-xl p-4 border border-white/10">
                                            <pre className="text-xs text-blue-300 font-mono overflow-x-auto custom-scrollbar pb-2">
                                                {`<!-- SupportGenie AI Widget -->
<script 
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget/widget.v1.js" 
  data-agent-id="${botId || 'b_xxxxxxxx'}"
  data-theme="dark"
  defer>
</script>`}
                                            </pre>
                                            <Button
                                                onClick={copyEmbedCode}
                                                size="sm"
                                                variant="secondary"
                                                className="absolute top-3 right-3 h-8 bg-white/10 hover:bg-white/20 text-white border-0"
                                            >
                                                {embedCopied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                                                {embedCopied ? "Copied!" : "Copy"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Chat Preview */}
                            <div className="md:col-span-2 border border-white/10 rounded-2xl bg-white/5 p-4 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-full flex justify-end">
                                    <div className="bg-gradient-primary text-white text-xs px-3 py-2 rounded-2xl rounded-tr-none max-w-[80%] text-left">
                                        Can you help me with pricing?
                                    </div>
                                </div>
                                <div className="w-full flex justify-start">
                                    <div className="bg-white/10 text-white text-xs px-3 py-2 rounded-2xl rounded-tl-none max-w-[80%] text-left border border-white/10">
                                        Certainly! Our pro plan starts at $49/month. Would you like to see the full feature list?
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-3 mt-4">
                                    <Button variant="gradient" className="w-full shadow-lg shadow-purple-500/20" onClick={() => router.push(`/dashboard/bots/${botId}`)}>
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Test Your Agent
                                    </Button>
                                    <Button variant="outline" className="w-full glass-panel border-white/10" onClick={() => router.push('/dashboard/bots')}>
                                        Manage All Agents
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
