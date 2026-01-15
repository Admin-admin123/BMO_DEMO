"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard, AuthInput, SocialButton, PasswordStrength } from "@/components/auth";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    const { signUp, isLoaded, setActive } = useSignUp();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError("");

        try {
            await signUp.create({
                firstName: formData.firstName,
                lastName: formData.lastName,
                emailAddress: formData.email,
                password: formData.password,
            });

            // Send email verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError.errors?.[0]?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError("");

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/");
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError.errors?.[0]?.message || "Invalid verification code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignup = async (provider: "oauth_google" | "oauth_github") => {
        if (!isLoaded) return;

        try {
            await signUp.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (err) {
            console.error("Social signup error:", err);
        }
    };

    // Verification View
    if (pendingVerification) {
        return (
            <AuthCard
                title="Verify your email"
                subtitle={`We sent a code to ${formData.email}`}
            >
                <form onSubmit={handleVerification}>
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

                    <AuthInput
                        label="Verification Code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        maxLength={6}
                    />

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl font-semibold text-base relative overflow-hidden disabled:opacity-70 mt-4"
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

                    <button
                        type="button"
                        onClick={() => setPendingVerification(false)}
                        className="w-full mt-3 py-2 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        ← Back to sign up
                    </button>
                </form>
            </AuthCard>
        );
    }

    // Sign Up View
    return (
        <AuthCard
            title="Create an account"
            subtitle="Get started with BMO"
        >
            <form onSubmit={handleSubmit}>
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

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                    <AuthInput
                        label="First Name"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                        required
                        autoComplete="given-name"
                    />
                    <AuthInput
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                        required
                        autoComplete="family-name"
                    />
                </div>

                {/* Email Input */}
                <AuthInput
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange("email")}
                    required
                    autoComplete="email"
                />

                {/* Password Input */}
                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    required
                    autoComplete="new-password"
                />

                {/* Password Strength */}
                <PasswordStrength password={formData.password} />

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
                            Creating account...
                        </span>
                    ) : (
                        "Create Account"
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
                        onClick={() => handleSocialSignup("oauth_google")}
                    />
                    <SocialButton
                        provider="github"
                        onClick={() => handleSocialSignup("oauth_github")}
                    />
                </div>

                {/* Sign In Link */}
                <p
                    className="text-center text-sm mt-6"
                    style={{ color: "var(--text-secondary)" }}
                >
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium transition-colors hover:underline"
                        style={{ color: "var(--accent)" }}
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
