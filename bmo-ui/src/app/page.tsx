"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

// Components
import ChatInput from "@/components/ChatInput";
import StaggeredMenu from "@/components/StaggeredMenu";
import BMOPersona from "@/components/BMOPersona";
import QuickActions from "@/components/QuickActions";

// API & Utils
import { sendTranscript, wakeSession } from "@/lib/api";

type Status = "idle" | "listening" | "thinking" | "speaking";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [sessionId, setSessionId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const ensureSession = useCallback(async () => {
        if (sessionId) return sessionId;
        try {
            const res = await wakeSession();
            setSessionId(res.session_id);
            return res.session_id;
        } catch {
            return null;
        }
    }, [sessionId]);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim()) return;

            // Add user message
            const userMsg: Message = {
                id: Date.now().toString(),
                role: "user",
                content: content.trim(),
            };
            setMessages((prev) => [...prev, userMsg]);
            setInput("");
            setStatus("thinking");

            try {
                const id = await ensureSession();
                if (!id) throw new Error("No session");

                const res = await sendTranscript(id, content);

                // Add assistant message
                const assistantMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: res.narration || "I'm here to help!",
                };
                setMessages((prev) => [...prev, assistantMsg]);

                // Play speech if available
                if (res.speech?.base64) {
                    setStatus("speaking");
                    const audio = new Audio(
                        `data:${res.speech.mime_type};base64,${res.speech.base64}`
                    );
                    audioRef.current = audio;
                    audio.onended = () => setStatus("idle");
                    audio.play().catch(() => setStatus("idle"));
                } else {
                    setStatus("idle");
                }
            } catch {
                const errorMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Sorry, I couldn't process that. Please try again.",
                };
                setMessages((prev) => [...prev, errorMsg]);
                setStatus("idle");
            }
        },
        [ensureSession]
    );

    const handleSubmit = () => {
        if (input.trim() && status === "idle") {
            sendMessage(input);
        }
    };

    const startListening = () => {
        const SR = getSpeechRecognition();
        if (!SR) return;

        const recognition = new SR();
        recognition.lang = "en-US";
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            sendMessage(transcript);
        };
        recognition.onerror = () => setStatus("idle");
        recognition.onend = () => {
            recognitionRef.current = null;
            if (status === "listening") setStatus("idle");
        };

        recognitionRef.current = recognition;
        setStatus("listening");
        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setStatus("idle");
    };

    const handleMicClick = () => {
        if (status === "listening") {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Navigation Menu */}
            <StaggeredMenu />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col" style={{ paddingTop: '100px' }}>
                {messages.length === 0 ? (
                    /* ═══════════════════════════════════════════════════════════
                       WELCOME STATE - Integrated Assistant Layout
                       Chat-focused design with BMO persona above
                    ═══════════════════════════════════════════════════════════ */
                    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                        <div className="flex flex-col items-center w-full max-w-3xl">
                            
                            {/* Section 1: BMO Persona (Eyes + Greeting) */}
                            <BMOPersona status={status} />

                            {/* Spacer */}
                            <div className="h-14" />

                            {/* Section 2: Chat Input - Primary Focus */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                                className="w-full"
                            >
                                <ChatInput
                                    input={input}
                                    setInput={setInput}
                                    onSubmit={handleSubmit}
                                    status={status}
                                    onMicClick={handleMicClick}
                                    placeholder="Ask BMO anything..."
                                    inline={true}
                                />
                            </motion.div>

                            {/* Spacer */}
                            <div className="h-16" />

                            {/* Section 3: Quick Actions - Bento Grid */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 20 }}
                                className="w-full mt-4"
                            >
                                <QuickActions 
                                    onAction={sendMessage} 
                                    variant="bento"
                                />
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    /* ═══════════════════════════════════════════════════════════
                       CHAT STATE - Conversation View (Opposite Sides)
                    ═══════════════════════════════════════════════════════════ */
                    <div className="flex-1 flex justify-center pt-16">
                        {/* Centered Messages Container */}
                        <div className="w-full max-w-3xl px-4 md:px-6 pb-44" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${
                                            msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                    >
                                        {/* Assistant Avatar - Left side */}
                                        {msg.role === "assistant" && (
                                            <div 
                                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                                                style={{
                                                    backgroundColor: 'var(--bg-chat)',
                                                    border: '1px solid var(--border)'
                                                }}
                                            >
                                                <Bot className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                                            </div>
                                        )}

                                        {/* Message Content */}
                                        <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                            <div 
                                                className="text-xs font-medium mb-1"
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                {msg.role === "user" ? "You" : "BMO"}
                                            </div>
                                            <div 
                                                className="text-base leading-relaxed"
                                                style={{ color: 'var(--text)' }}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        </div>

                                        {/* User Avatar - Right side */}
                                        {msg.role === "user" && (
                                            <div 
                                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                                                style={{ backgroundColor: 'var(--accent)' }}
                                            >
                                                <span className="text-sm font-semibold" style={{ color: 'var(--bg)' }}>
                                                    Y
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Thinking Indicator */}
                            {status === "thinking" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 justify-start"
                                >
                                    <div 
                                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                                        style={{
                                            backgroundColor: 'var(--bg-chat)',
                                            border: '1px solid var(--border)'
                                        }}
                                    >
                                        <Bot className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div className="text-left">
                                        <div 
                                            className="text-xs font-medium mb-1"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            BMO
                                        </div>
                                        <div className="flex gap-1 py-2">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: 'var(--text-secondary)' }}
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        delay: i * 0.2,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                )}
            </main>

            {/* Fixed Chat Input - Only visible when in chat mode */}
            {messages.length > 0 && (
                <ChatInput
                    input={input}
                    setInput={setInput}
                    onSubmit={handleSubmit}
                    status={status}
                    onMicClick={handleMicClick}
                />
            )}
        </div>
    );
}
