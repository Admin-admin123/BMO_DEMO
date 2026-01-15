"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard, AuthInput } from "@/components/auth";
import { Loader2, Mail, CheckCircle, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
    const { signUp, isLoaded } = useSignUp();
    const { isSignedIn } = useUser();
    const router = useRouter();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [verified, setVerified] = useState(false);

    // Redirect if already signed in
    useEffect(() => {
        if (isSignedIn) {
            router.push("/");
        }
    }, [isSignedIn, router]);

    // Cooldown timer
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || !signUp) return;

        setIsLoading(true);
        setError("");

        try {
            const result = await signUp.attemptEmailAddressVerification({ code });

            if (result.status === "complete") {
                setVerified(true);
                setTimeout(() => router.push("/"), 2000);
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError.errors?.[0]?.message || "Invalid verification code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!isLoaded || !signUp || cooldown > 0) return;

        setIsResending(true);
        setError("");

        try {
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setCooldown(60); // 60 second cooldown
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError.errors?.[0]?.message || "Failed to resend code");
        } finally {
            setIsResending(false);
        }
    };

    // Success View
    if (verified) {
        return (
            <AuthCard
                title="Email Verified!"
                subtitle="Redirecting you to BMO..."
            >
                <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <motion.div
                        className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{
                            background: "rgba(var(--success-rgb), 0.1)",
                            border: "1px solid var(--success)",
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <CheckCircle
                            className="w-10 h-10"
                            style={{ color: "var(--success)" }}
                        />
                    </motion.div>

                    <motion.div
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Loader2
                            className="w-4 h-4 animate-spin"
                            style={{ color: "var(--text-secondary)" }}
                        />
                        <span style={{ color: "var(--text-secondary)" }}>
                            Redirecting...
                        </span>
                    </motion.div>
                </motion.div>
            </AuthCard>
        );
    }

    // Verification Form
    return (
        <AuthCard
            title="Verify your email"
            subtitle="Enter the 6-digit code we sent you"
        >
            <form onSubmit={handleVerify}>
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

                {/* Code Input */}
                <AuthInput
                    label="Verification Code"
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                />

                {/* Verify Button */}
                <motion.button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
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
                            Verifying...
                        </span>
                    ) : (
                        "Verify Email"
                    )}
                </motion.button>

                {/* Resend Button */}
                <div className="text-center mt-6">
                    <p
                        className="text-sm mb-2"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Didn&apos;t receive the code?
                    </p>
                    <motion.button
                        type="button"
                        onClick={handleResend}
                        disabled={cooldown > 0 || isResending}
                        className="text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-50"
                        style={{ color: "var(--accent)" }}
                        whileHover={{ scale: cooldown > 0 ? 1 : 1.02 }}
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Resending...
                            </>
                        ) : cooldown > 0 ? (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                Resend in {cooldown}s
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                Resend Code
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Back to Signup */}
                <Link
                    href="/signup"
                    className="block text-center text-sm mt-6 transition-colors hover:underline"
                    style={{ color: "var(--text-secondary)" }}
                >
                    ← Back to Sign Up
                </Link>
            </form>
        </AuthCard>
    );
}
