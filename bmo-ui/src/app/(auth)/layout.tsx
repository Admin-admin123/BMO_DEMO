import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{
                background: `
                    radial-gradient(ellipse at top, var(--accent)08 0%, transparent 50%),
                    radial-gradient(ellipse at bottom right, var(--accent-hover)05 0%, transparent 40%),
                    var(--bg)
                `,
            }}
        >
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Floating orbs */}
                <div
                    className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse"
                    style={{
                        background: "var(--accent)",
                        opacity: 0.03,
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
                    style={{
                        background: "var(--accent-hover)",
                        opacity: 0.02,
                        animationDelay: "1s",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}
