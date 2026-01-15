"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Plus, Upload, Palette, Sparkles } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ChatStatus = "idle" | "listening" | "thinking" | "speaking";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    onSubmit: () => void;
    status: ChatStatus;
    onMicClick: () => void;
    placeholder?: string;
    inline?: boolean;
}

// Dynamic placeholder suggestions
const PLACEHOLDER_SUGGESTIONS = [
    "Ask BMO anything...",
    "Try 'Summarize my last lecture'...",
    "Upload a PDF to analyze...",
    "Say 'Navigate to Building 5'...",
    "Ask 'What events are today?'...",
];

export default function ChatInput({
    input,
    setInput,
    onSubmit,
    status,
    onMicClick,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    placeholder = "Ask BMO anything...",
    inline = false
}: ChatInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Rotate placeholder text
    useEffect(() => {
        if (isFocused || input) return; // Don't rotate when focused or has input
        
        const rotateInterval = setInterval(() => {
            setIsPlaceholderVisible(false);
            setTimeout(() => {
                setCurrentPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length);
                setIsPlaceholderVisible(true);
            }, 300);
        }, 4000);

        return () => clearInterval(rotateInterval);
    }, [isFocused, input]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && input.trim()) {
            onSubmit();
        }
    };

    const currentPlaceholder = status === "listening" 
        ? "Listening..." 
        : PLACEHOLDER_SUGGESTIONS[currentPlaceholderIndex];

    return (
        <div className={inline ? "w-full" : "fixed bottom-0 left-0 right-0 p-4 pt-12 flex flex-col items-center z-40"}>
            {/* Gradient Mask for content behind - only show when fixed */}
            {!inline && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to top, var(--bg) 60%, transparent 100%)',
                        backdropFilter: 'blur(1px)'
                    }}
                />
            )}

            <div className={`w-full ${inline ? '' : 'max-w-[700px]'} relative z-10`}>
                <div className="relative group">
                    
                    {/* Ambient Glow Effect - Uses accent color */}
                    <motion.div
                        className="absolute -inset-[2px] rounded-[9999px] blur-[8px]"
                        style={{
                            background: 'linear-gradient(90deg, var(--accent), var(--accent-hover), var(--accent))'
                        }}
                        animate={{
                            opacity: isFocused ? 0.4 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Main Glass Container - "The Neural Link" */}
                    <motion.div
                        className="neural-link-container relative rounded-[9999px]"
                        animate={{
                            y: isFocused ? -2 : 0
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {/* Glass Background - Theme Aware */}
                        <div
                            className="absolute inset-0 rounded-[9999px]"
                            style={{
                                background: 'var(--bg-secondary)',
                                opacity: 0.95,
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                            }}
                        />
                        
                        {/* Border Layer - Theme Aware */}
                        <motion.div
                            className="absolute inset-0 rounded-[9999px] pointer-events-none"
                            style={{
                                border: '1px solid var(--border)',
                            }}
                            animate={{
                                borderColor: isFocused 
                                    ? 'var(--accent)' 
                                    : 'var(--border)',
                                boxShadow: isFocused
                                    ? '0 0 20px color-mix(in srgb, var(--accent) 30%, transparent), 0 4px 20px rgba(0, 0, 0, 0.15)'
                                    : '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Content Layer */}
                        <div className="relative flex items-center gap-2 p-2 pl-2">
                            
                            {/* Left: Shadcn Dropdown Menu */}
                            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 outline-none"
                                        style={{
                                            backgroundColor: dropdownOpen ? 'color-mix(in srgb, var(--accent) 15%, var(--bg-chat))' : 'var(--bg-chat)',
                                            border: dropdownOpen ? '2px solid var(--accent)' : '1px solid var(--border)',
                                            boxShadow: dropdownOpen ? '0 0 12px color-mix(in srgb, var(--accent) 40%, transparent)' : 'none'
                                        }}
                                    >
                                        <motion.div
                                            animate={{ rotate: dropdownOpen ? 45 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Plus 
                                                className="w-5 h-5 transition-colors" 
                                                style={{ 
                                                    color: dropdownOpen ? 'var(--accent)' : 'var(--text-secondary)' 
                                                }} 
                                            />
                                        </motion.div>
                                    </motion.button>
                                </DropdownMenuTrigger>
                                
                                <DropdownMenuContent 
                                    side="top" 
                                    align="start" 
                                    sideOffset={12}
                                    className="w-72 p-2 rounded-2xl backdrop-blur-xl shadow-2xl"
                                    style={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderColor: 'var(--border)',
                                    }}
                                >
                                    <DropdownMenuLabel 
                                        className="text-[11px] font-semibold uppercase tracking-widest px-2 py-1.5"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        Quick Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator style={{ backgroundColor: 'var(--border)' }} className="my-1" />
                                    
                                    <DropdownMenuItem 
                                        className="flex items-center gap-3 px-2 py-3 rounded-xl cursor-pointer group transition-colors"
                                        style={{ 
                                            ['--hover-bg' as string]: 'color-mix(in srgb, var(--accent) 15%, transparent)',
                                        }}
                                        onSelect={() => console.log('Upload')}
                                    >
                                        <div 
                                            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                                            style={{ 
                                                backgroundColor: 'var(--bg-chat)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            <Upload size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div 
                                                className="text-sm font-medium"
                                                style={{ color: 'var(--text)' }}
                                            >
                                                Upload File
                                            </div>
                                            <div 
                                                className="text-xs"
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                PDFs, Images, Docs
                                            </div>
                                        </div>
                                        <DropdownMenuShortcut 
                                            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                                            style={{ 
                                                borderWidth: '1px',
                                                borderColor: 'var(--border)',
                                                backgroundColor: 'var(--bg-chat)',
                                                color: 'var(--text-secondary)'
                                            }}
                                        >
                                            ⌘U
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem 
                                        className="flex items-center gap-3 px-2 py-3 rounded-xl cursor-pointer group transition-colors"
                                        onSelect={() => console.log('Canvas')}
                                    >
                                        <div 
                                            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                                            style={{ 
                                                backgroundColor: 'var(--bg-chat)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            <Palette size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div 
                                                className="text-sm font-medium"
                                                style={{ color: 'var(--text)' }}
                                            >
                                                Canvas Mode
                                            </div>
                                            <div 
                                                className="text-xs"
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                Visual brainstorming
                                            </div>
                                        </div>
                                        <DropdownMenuShortcut 
                                            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                                            style={{ 
                                                borderWidth: '1px',
                                                borderColor: 'var(--border)',
                                                backgroundColor: 'var(--bg-chat)',
                                                color: 'var(--text-secondary)'
                                            }}
                                        >
                                            ⌘K
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem 
                                        className="flex items-center gap-3 px-2 py-3 rounded-xl cursor-pointer group transition-colors"
                                        onSelect={() => console.log('Switch')}
                                    >
                                        <div 
                                            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                                            style={{ 
                                                backgroundColor: 'var(--bg-chat)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            <Sparkles size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div 
                                                className="text-sm font-medium"
                                                style={{ color: 'var(--text)' }}
                                            >
                                                Switch Mode
                                            </div>
                                            <div 
                                                className="text-xs"
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                Change personality
                                            </div>
                                        </div>
                                        <DropdownMenuShortcut 
                                            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                                            style={{ 
                                                borderWidth: '1px',
                                                borderColor: 'var(--border)',
                                                backgroundColor: 'var(--bg-chat)',
                                                color: 'var(--text-secondary)'
                                            }}
                                        >
                                            ⌘M
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Center: Input Field with Dynamic Placeholder */}
                            <div className="flex-1 relative min-w-0">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={status !== "idle" && status !== "listening"}
                                    className="w-full bg-transparent border-none outline-none py-3 text-base min-w-0 placeholder-transparent"
                                    style={{ color: 'var(--text)' }}
                                    autoComplete="off"
                                />
                                
                                {/* Custom Animated Placeholder */}
                                {!input && (
                                    <motion.span
                                        className="absolute left-0 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none"
                                        style={{ color: 'var(--text-secondary)' }}
                                        initial={{ opacity: 0 }}
                                        animate={{ 
                                            opacity: isPlaceholderVisible ? 0.7 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {currentPlaceholder}
                                    </motion.span>
                                )}
                            </div>

                            {/* Right: Voice & Send - "The Action Zone" */}
                            <div className="flex items-center gap-2 pr-1">
                                <AnimatePresence mode="wait">
                                    {input.trim() ? (
                                        /* Send Button - Uses accent color */
                                        <motion.button
                                            key="send"
                                            initial={{ scale: 0, opacity: 0, rotate: -90 }}
                                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                            exit={{ scale: 0, opacity: 0, rotate: 90 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onSubmit}
                                            disabled={status !== "idle" && status !== "listening"}
                                            className="w-11 h-11 rounded-full flex items-center justify-center transition-all send-btn"
                                            style={{
                                                background: 'var(--accent)',
                                                boxShadow: '0 4px 15px color-mix(in srgb, var(--accent) 40%, transparent)'
                                            }}
                                        >
                                            <Send className="w-5 h-5 ml-0.5" style={{ color: 'var(--bg)' }} />
                                        </motion.button>
                                    ) : (
                                        /* Mic Button - Theme Aware */
                                        <motion.button
                                            key="mic"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onMicClick}
                                            disabled={status === "thinking" || status === "speaking"}
                                            className="mic-btn w-11 h-11 rounded-full flex items-center justify-center transition-all relative overflow-hidden"
                                            style={{
                                                backgroundColor: status === "listening" 
                                                    ? 'var(--error)' 
                                                    : 'var(--bg-chat)',
                                                border: status === "listening" 
                                                    ? '2px solid var(--error)'
                                                    : '1px solid var(--border)'
                                            }}
                                        >
                                            {/* Listening Pulse Animation */}
                                            {status === "listening" && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full"
                                                    style={{ backgroundColor: 'var(--error)', opacity: 0.3 }}
                                                    animate={{ 
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.3, 0, 0.3]
                                                    }}
                                                    transition={{ 
                                                        repeat: Infinity, 
                                                        duration: 1.5,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            )}
                                            
                                            {status === "listening" ? (
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                >
                                                    <MicOff className="w-5 h-5" style={{ color: 'var(--bg)' }} />
                                                </motion.div>
                                            ) : (
                                                <Mic className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                                            )}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Text - only show when fixed */}
                {!inline && (
                    <motion.p 
                        className="text-center text-xs mt-4 font-medium"
                        style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                    >
                        BMO may make mistakes. Always verify important information.
                    </motion.p>
                )}
            </div>
        </div>
    );
}
