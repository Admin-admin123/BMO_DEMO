"use client";

import { motion } from "framer-motion";
import BMOEyes from "./bmo-eyes";
import DynamicGreeting from "./DynamicGreeting";

type Status = "idle" | "listening" | "thinking" | "speaking";

interface BMOPersonaProps {
    status: Status;
    className?: string;
    compact?: boolean;
}

export default function BMOPersona({
    status,
    className = "",
    compact = false,
}: BMOPersonaProps) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={className}
        >
            {/* Clean Persona Container - Eyes + Greeting Only */}
            <div
                className="relative flex flex-col items-center justify-center rounded-3xl overflow-hidden"
                style={{
                    width: compact ? "380px" : "460px",
                    padding: compact ? "28px 24px 24px" : "36px 32px 28px",
                    background: "linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-chat) 100%)",
                    border: "2px solid var(--border)",
                    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2), inset 0 2px 16px rgba(0, 0, 0, 0.08)",
                }}
            >
                {/* Ambient Glow Effect */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at 50% 30%, var(--accent) 0%, transparent 50%)",
                        opacity: 0.08,
                    }}
                />

                {/* Eyes */}
                <div className={compact ? "mb-3" : "mb-4"}>
                    <BMOEyes status={status} size={compact ? "lg" : "xl"} />
                </div>

                {/* Greeting Text - Smaller, inside container */}
                <div className="text-center relative z-10">
                    <DynamicGreeting 
                        textSize="sm"
                        showEmoji={true}
                    />
                </div>
            </div>
        </motion.div>
    );
}
