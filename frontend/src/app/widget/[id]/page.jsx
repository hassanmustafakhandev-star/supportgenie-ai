"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatWidget } from "@/components/ChatWidget";

export default function StandaloneWidget() {
    const { id } = useParams();
    const [botName, setBotName] = useState("SupportGenie AI");

    useEffect(() => {
        // Optionally fetch bot details to customize title
        const fetchBot = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/${id}/details`);
                const data = await res.json();
                if (data.name) setBotName(data.name);
            } catch (e) {
                console.error("Widget: could not load bot name", e);
            }
        };
        if (id) fetchBot();
    }, [id]);

    return (
        <div className="bg-transparent overflow-hidden h-screen w-screen flex flex-col justify-end items-end p-0">
            <ChatWidget 
                botId={id} 
                title={botName}
                position="right"
            />
            <style jsx global>{`
                body {
                    background: transparent !important;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
