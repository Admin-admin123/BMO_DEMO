"use client";

import { useMemo, useSyncExternalStore } from "react";
import SplitText from "./SplitText";
import { generateGreeting, estimateWeather } from "@/lib/greetings";

interface DynamicGreetingProps {
    className?: string;
    showEmoji?: boolean;
    textSize?: "sm" | "md" | "lg" | "xl";
}

const textSizeMap = {
    sm: "text-base md:text-lg",
    md: "text-lg md:text-xl",
    lg: "text-xl md:text-2xl",
    xl: "text-2xl md:text-3xl",
};

// Safe hydration hook - returns true only on client
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function DynamicGreeting({
    className = "",
    showEmoji = true,
    textSize = "lg",
}: DynamicGreetingProps) {
    const isClient = useIsClient();

    const greetingData = useMemo(() => {
        if (!isClient) return { greeting: "", emoji: "" };
        const now = new Date();
        const weather = estimateWeather(now.getHours(), now.getMonth());
        return generateGreeting(now, weather);
    }, [isClient]);

    if (!greetingData.greeting) return null;

    return (
        <div className={`flex flex-col items-center gap-1.5 ${className}`}>
            {showEmoji && (
                <span className="text-2xl animate-bounce-subtle">{greetingData.emoji}</span>
            )}
            <SplitText
                text={greetingData.greeting}
                tag="h1"
                className={`${textSizeMap[textSize]} font-semibold text-[var(--text)] text-center`}
                delay={40}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40, rotateX: 90 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
            />
        </div>
    );
}
