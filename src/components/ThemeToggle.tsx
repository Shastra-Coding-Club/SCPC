"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeContext"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            type="button"
            className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300",
                "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
                "border border-transparent hover:border-gray-300 dark:hover:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            )}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {/* Sun Icon */}
            <Sun
                className={cn(
                    "absolute h-5 w-5 transition-all duration-300",
                    theme === "light"
                        ? "rotate-0 scale-100 text-orange-500"
                        : "rotate-90 scale-0 text-orange-500"
                )}
            />
            {/* Moon Icon */}
            <Moon
                className={cn(
                    "absolute h-5 w-5 transition-all duration-300",
                    theme === "dark"
                        ? "rotate-0 scale-100 text-yellow-400"
                        : "-rotate-90 scale-0 text-yellow-400"
                )}
            />
        </button>
    )
}
