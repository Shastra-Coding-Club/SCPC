"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper to get initial theme (must match the inline script in layout.tsx)
function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "light"
    
    try {
        const stored = localStorage.getItem("theme") as Theme | null
        if (stored === "dark" || stored === "light") {
            return stored
        }
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark"
        }
    } catch (e) {
        // localStorage not available
    }
    return "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light")
    const [mounted, setMounted] = useState(false)

    // Initialize theme on mount
    useEffect(() => {
        const initialTheme = getInitialTheme()
        setTheme(initialTheme)
        setMounted(true)
    }, [])

    // Apply theme changes to DOM and localStorage
    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement
        
        // Always explicitly set the correct state
        if (theme === "dark") {
            root.classList.add("dark")
            root.classList.remove("light")
        } else {
            root.classList.remove("dark")
            root.classList.add("light")
        }
        
        localStorage.setItem("theme", theme)
    }, [theme, mounted])

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
