"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard, AuthInput, SocialButton } from "@/components/auth";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const { signIn, isLoaded, setActive } = useSignIn();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError("");

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/");
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError.errors?.[0]?.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "oauth_google" | "oauth_github") => {
        if (!isLoaded) return;

        try {
            await signIn.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (err) {
            console.error("Social login error:", err);
        }
    };

    return (
        <AuthCard
            title="Welcome back"
            subtitle="Sign in to continue to BMO"
        >
            <form onSubmit={handleSubmit}>
                {/* Error Alert */}
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
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                {/* Password Input */}
                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />

                {/* Forgot Password Link */}
                <div className="flex justify-end mb-6">
                    <Link
                        href="/forgot-password"
                        className="text-sm transition-colors hover:underline"
                        style={{ color: "var(--accent)" }}
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-semibold text-base relative overflow-hidden disabled:opacity-70"
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
                            Signing in...
                        </span>
                    ) : (
                        "Sign In"
                    )}

                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        }}
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        or continue with
                    </span>
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">
                    <SocialButton
                        provider="google"
                        onClick={() => handleSocialLogin("oauth_google")}
                    />
                    <SocialButton
                        provider="github"
                        onClick={() => handleSocialLogin("oauth_github")}
                    />
                </div>

                {/* Sign Up Link */}
                <p
                    className="text-center text-sm mt-6"
                    style={{ color: "var(--text-secondary)" }}
                >
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-medium transition-colors hover:underline"
                        style={{ color: "var(--accent)" }}
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
