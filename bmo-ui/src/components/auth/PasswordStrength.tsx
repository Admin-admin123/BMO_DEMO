"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
    password: string;
}

interface Requirement {
    label: string;
    test: (password: string) => boolean;
}

const requirements: Requirement[] = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "Contains number", test: (p) => /[0-9]/.test(p) },
    { label: "Contains special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const strength = useMemo(() => {
        if (!password) return 0;
        return requirements.filter((req) => req.test(password)).length;
    }, [password]);

    const strengthConfig = useMemo(() => {
        if (strength === 0) return { label: "", color: "var(--border)", width: "0%" };
        if (strength <= 2) return { label: "Weak", color: "var(--error)", width: "33%" };
        if (strength <= 4) return { label: "Medium", color: "#f59e0b", width: "66%" };
        return { label: "Strong", color: "var(--success)", width: "100%" };
    }, [strength]);

    if (!password) return null;

    return (
        <motion.div
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
        >
            {/* Strength Bar */}
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-chat)" }}
                >
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: strengthConfig.color }}
                        initial={{ width: "0%" }}
                        animate={{ width: strengthConfig.width }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>
                <span
                    className="text-xs font-medium min-w-[60px]"
                    style={{ color: strengthConfig.color }}
                >
                    {strengthConfig.label}
                </span>
            </div>

            {/* Requirements List */}
            <div className="space-y-1.5">
                {requirements.map((req, index) => {
                    const isPassed = req.test(password);
                    return (
                        <motion.div
                            key={req.label}
                            className="flex items-center gap-2 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <motion.div
                                className="w-4 h-4 rounded-full flex items-center justify-center"
                                style={{
                                    background: isPassed ? "var(--success)" : "var(--bg-chat)",
                                    color: isPassed ? "var(--bg)" : "var(--text-secondary)",
                                }}
                                animate={{ scale: isPassed ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isPassed ? (
                                    <Check className="w-2.5 h-2.5" />
                                ) : (
                                    <X className="w-2.5 h-2.5" />
                                )}
                            </motion.div>
                            <span style={{ color: isPassed ? "var(--success)" : "var(--text-secondary)" }}>
                                {req.label}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
