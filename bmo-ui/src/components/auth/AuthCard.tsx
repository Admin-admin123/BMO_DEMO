"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthCardProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
    return (
        <motion.div
            className="w-full max-w-[440px] mx-auto"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.1
            }}
        >
            {/* Glass Card */}
            <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                }}
            >
                {/* Gradient border effect */}
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        padding: "1px",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05), var(--accent)20)",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                    }}
                />

                {/* Content */}
                <div className="relative p-8 sm:p-10">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* BMO Logo */}
                        <motion.div
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl"
                            style={{
                                background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                                boxShadow: "0 8px 24px rgba(var(--accent-rgb), 0.3)",
                            }}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            🤖
                        </motion.div>

                        <h1
                            className="text-2xl font-bold mb-2"
                            style={{ color: "var(--text)" }}
                        >
                            {title}
                        </h1>
                        {subtitle && (
                            <p
                                className="text-sm"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </motion.div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
