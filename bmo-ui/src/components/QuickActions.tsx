"use client";

import { motion } from "framer-motion";
import MagicBento, { BentoCardData } from "./MagicBento";

interface QuickActionsProps {
    onAction: (action: string) => void;
    className?: string;
    variant?: "pills" | "icons" | "compact" | "bento";
}

const defaultActions: BentoCardData[] = [
    { emoji: "🗺️", title: "Navigate", description: "Find your way", action: "Navigate to my class" },
    { emoji: "📚", title: "Canvas", description: "Check assignments", action: "Check Canvas" },
    { emoji: "👨‍🏫", title: "Professor", description: "Office hours", action: "Find a professor" },
    { emoji: "❓", title: "Help", description: "Get started", action: "What can you do?" },
];

export default function QuickActions({
    onAction,
    className = "",
    variant = "pills",
}: QuickActionsProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring" as const, stiffness: 400, damping: 25 },
        },
    };

    // Bento variant - uses MagicBento with particle effects
    if (variant === "bento") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                className={className}
            >
                <MagicBento
                    cards={defaultActions}
                    onCardClick={onAction}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableParticles={true}
                    clickEffect={true}
                    particleCount={6}
                    glowColor="var(--accent)"
                />
            </motion.div>
        );
    }

    if (variant === "compact") {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`flex flex-wrap justify-center gap-2 ${className}`}
            >
                {defaultActions.map((item) => (
                    <motion.button
                        key={item.title}
                        variants={itemVariants}
                        onClick={() => onAction(item.action)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-chat)] transition-all flex items-center justify-center text-lg"
                        title={item.title}
                    >
                        {item.emoji}
                    </motion.button>
                ))}
            </motion.div>
        );
    }

    if (variant === "icons") {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`flex flex-wrap justify-center gap-3 ${className}`}
            >
                {defaultActions.map((item) => (
                    <motion.button
                        key={item.title}
                        variants={itemVariants}
                        onClick={() => onAction(item.action)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-chat)] transition-all"
                    >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="text-xs text-[var(--text-secondary)]">{item.title}</span>
                    </motion.button>
                ))}
            </motion.div>
        );
    }

    // Default: pills variant
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`flex flex-wrap justify-center gap-3 ${className}`}
        >
            {defaultActions.map((item) => (
                <motion.button
                    key={item.title}
                    variants={itemVariants}
                    onClick={() => onAction(item.action)}
                    whileHover={{ 
                        scale: 1.02, 
                        backgroundColor: "var(--bg-chat)",
                        borderColor: "var(--accent)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] transition-all text-base"
                >
                    <span>{item.emoji}</span>
                    <span className="text-[var(--text-secondary)]">{item.title}</span>
                </motion.button>
            ))}
        </motion.div>
    );
}
