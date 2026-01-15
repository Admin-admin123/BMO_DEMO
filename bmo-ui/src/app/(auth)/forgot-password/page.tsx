"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { AuthCard, AuthInput } from "@/components/auth";
import { Loader2, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const { signIn, isLoaded } = useSignIn();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError("");

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            });
            setEmailSent(true);
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError.errors?.[0]?.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    // Success View
    if (emailSent) {
        return (
            <AuthCard
                title="Check your email"
                subtitle="We've sent you a password reset link"
            >
                <motion.div
                    className="text-center py-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    {/* Success Icon */}
                    <motion.div
                        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                        style={{
                            background: "rgba(var(--success-rgb), 0.1)",
                            border: "1px solid var(--success)",
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                        <CheckCircle
                            className="w-10 h-10"
                            style={{ color: "var(--success)" }}
                        />
                    </motion.div>

                    <p
                        className="text-sm mb-2"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        We sent a reset link to
                    </p>
                    <p
                        className="font-medium mb-6"
                        style={{ color: "var(--text)" }}
                    >
                        {email}
                    </p>

                    <button
                        onClick={() => setEmailSent(false)}
                        className="text-sm transition-colors hover:underline"
                        style={{ color: "var(--accent)" }}
                    >
                        Didn&apos;t receive the email? Try again
                    </button>
                </motion.div>

                <Link
                    href="/login"
                    className="block w-full py-3 rounded-xl font-medium text-center mt-4 transition-colors"
                    style={{
                        background: "var(--bg-chat)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                    }}
                >
                    Back to Sign In
                </Link>
            </AuthCard>
        );
    }

    // Form View
    return (
        <AuthCard
            title="Forgot password?"
            subtitle="No worries, we'll send you reset instructions"
        >
            <form onSubmit={handleSubmit}>
                {/* Icon */}
                <motion.div
                    className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{
                        background: "var(--bg-chat)",
                        border: "1px solid var(--border)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Mail className="w-7 h-7" style={{ color: "var(--accent)" }} />
                </motion.div>

                {error && (
                    <motion.div
                        className="mb-4 p-3 rounded-xl text-sm"
                        style={{
                            background: "rgba(var(--error-rgb), 0.1)",
                            border: "1px solid var(--error)",
                            color: "var(--error)",
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* Email Input */}
                <AuthInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-semibold text-base relative overflow-hidden disabled:opacity-70 mt-2"
                    style={{
                        background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                        color: "var(--bg)",
                        boxShadow: "0 4px 15px rgba(var(--accent-rgb), 0.3)",
                    }}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                        </span>
                    ) : (
                        "Send Reset Link"
                    )}
                </motion.button>

                {/* Back to Login */}
                <Link
                    href="/login"
                    className="block text-center text-sm mt-6 transition-colors hover:underline"
                    style={{ color: "var(--text-secondary)" }}
                >
                    ← Back to Sign In
                </Link>
            </form>
        </AuthCard>
    );
}
