"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#timeline", label: "Timeline" },
  { href: "#prizes", label: "Prizes" },
  { href: "#contact", label: "Contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "py-3" : "py-5")}>
      <nav
        className={cn(
          "mx-auto flex items-center justify-between px-6 transition-all duration-300",
          scrolled
            ? "max-w-5xl rounded-full border border-black/20 bg-white/80 backdrop-blur-xl shadow-lg mx-4 lg:mx-auto py-2 px-4"
            : "max-w-6xl",
        )}
      >
        {/* Logo */}
        <Link href="#home" className="flex items-center gap-2.5 group">
          <span className="text-2xl font-bold tracking-tight text-black">
            SCPC
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section - CTA */}
        <div className="flex items-center gap-2">
          <Link href="#contact">
            <Button size="sm" className="rounded-lg bg-black px-5 text-white shadow-md hover:bg-gray-800 active:scale-[0.98] transition-all duration-200">
              Register
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 text-black" /> : <Menu className="h-5 w-5 text-black" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 border-b border-gray-200 bg-white/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-gray-200 my-2" />
              <Link href="#contact" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-black">
                  Contact
                </Button>
              </Link>
              <Link href="#contact" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-all duration-200">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
