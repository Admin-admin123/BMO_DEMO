"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
    const { handleRedirectCallback } = useClerk();
    const router = useRouter();

    useEffect(() => {
        const processCallback = async () => {
            try {
                await handleRedirectCallback({
                    redirectUrl: "/",
                    afterSignInUrl: "/",
                    afterSignUpUrl: "/",
                });
                router.push("/");
            } catch (err) {
                console.error("SSO Callback error:", err);
                router.push("/login");
            }
        };

        processCallback();
    }, [handleRedirectCallback, router]);


    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: "var(--bg)" }}
        >
            <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl"
                    style={{
                        background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                        boxShadow: "0 8px 24px rgba(var(--accent-rgb), 0.3)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    🤖
                </motion.div>
                <div className="flex items-center justify-center gap-2">
                    <Loader2
                        className="w-5 h-5 animate-spin"
                        style={{ color: "var(--accent)" }}
                    />
                    <span style={{ color: "var(--text)" }}>
                        Completing sign in...
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
