"use client";

import { Check, CreditCard, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
    const plans = [
        {
            name: "Starter",
            description: "Perfect for testing the waters",
            price: "$0",
            period: "forever",
            features: ["1 Custom Agent", "100 messages/month", "Basic training limits", "Community support"],
            current: false,
        },
        {
            name: "Pro",
            description: "Best for growing businesses",
            price: "$49",
            period: "/month",
            features: ["5 Custom Agents", "5,000 messages/month", "Advanced PDF parsing", "Remove 'Powered By' branding", "Priority email support"],
            current: true,
            popular: true,
        },
        {
            name: "Enterprise",
            description: "For large scale deployment",
            price: "$199",
            period: "/month",
            features: ["Unlimited Agents", "50,000 messages/month", "Website crawling", "Custom webhooks & API", "24/7 Phone Support"],
            current: false,
        }
    ];

    return (
        <div className="space-y-10 max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
                <p className="text-muted-foreground mt-2">Manage your subscription, view past invoices, and upgrade your limits.</p>
            </div>

            {/* Current Plan Overview */}
            <Card className="glass-panel border-white/10 overflow-hidden relative border-purple-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
                <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-primary text-white text-xs font-semibold uppercase tracking-wider mb-2">
                                <Sparkles className="w-3 h-3 mr-1" /> Active Plan
                            </div>
                            <h2 className="text-2xl font-bold">Pro Tier</h2>
                            <p className="text-muted-foreground max-w-md">You are currently using 60% of your allocated messages for this billing cycle.</p>
                        </div>

                        <div className="w-full md:w-1/3 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Monthly Messages</span>
                                <span className="font-medium">3,000 / 5,000</span>
                            </div>
                            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-gradient-primary w-[60%] rounded-full shadow-[0_0_10px_#8b5cf6]" />
                            </div>
                            <p className="text-xs text-muted-foreground text-right">Resets on Nov 15, 2023</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Grids */}
            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.name} className={`glass-panel relative flex flex-col ${plan.popular ? "border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.15)] ring-1 ring-purple-500" : "border-white/10"
                        }`}>
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                MOST POPULAR
                            </div>
                        )}

                        <CardHeader className="text-center pt-8">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="mt-4 flex items-baseline justify-center text-5xl font-extrabold">
                                {plan.price}
                                <span className="ml-1 text-xl font-medium text-muted-foreground">
                                    {plan.period}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-3" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="pt-6 pb-8">
                            <Button
                                variant={plan.popular ? "gradient" : "outline"}
                                className={`w-full ${plan.popular ? "" : "glass-panel border-white/20 hover:bg-white/10"}`}
                                disabled={plan.current}
                            >
                                {plan.current ? "Current Plan" : "Upgrade via Stripe"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" /> Secure payments powered by <b>Mock Stripe Checkout</b>
                </p>
            </div>
        </div>
    );
}
