"use client";

import { motion } from "framer-motion";
import { useState, forwardRef, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
    label: string;
    error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, error, type = "text", className = "", ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword ? (showPassword ? "text" : "password") : type;

        return (
            <motion.div
                className="relative mb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                {/* Label */}
                <label
                    className="block text-sm font-medium mb-2 transition-colors"
                    style={{ color: error ? "var(--error)" : "var(--text-secondary)" }}
                >
                    {label}
                </label>

                {/* Input Container */}
                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        className={`
                            w-full px-4 py-3 rounded-xl text-base
                            transition-all duration-200 outline-none
                            ${isPassword ? "pr-12" : ""}
                            ${className}
                        `}
                        style={{
                            background: "var(--bg-chat)",
                            color: "var(--text)",
                            border: `1px solid ${error ? "var(--error)" : isFocused ? "var(--accent)" : "var(--border)"}`,
                            boxShadow: isFocused
                                ? "0 0 0 3px rgba(var(--accent-rgb), 0.15), 0 4px 12px rgba(0,0,0,0.1)"
                                : "none",
                            transform: isFocused ? "scale(1.01)" : "scale(1)",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />

                    {/* Password Toggle */}
                    {isPassword && (
                        <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                            style={{ color: "var(--text-secondary)" }}
                            whileHover={{ scale: 1.1, color: "var(--text)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </motion.button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <motion.p
                        className="text-xs mt-1.5"
                        style={{ color: "var(--error)" }}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.p>
                )}
            </motion.div>
        );
    }
);

AuthInput.displayName = "AuthInput";

