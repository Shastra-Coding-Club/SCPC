"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SCPC_LOGO_URL } from "@/lib/constants"

// We use 'id' to find the section, but 'label' for the text.
const navLinks = [
  { id: "about", label: "About" },
  { id: "timeline", label: "Timeline" },
  { id: "prizes", label: "Prizes" },
  { id: "contact", label: "Contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // --- THE SCROLL HANDLER ---
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault(); // 1. Stop the browser from changing the URL
    setMobileOpen(false);

    const element = document.getElementById(targetId);
    if (element) {
      // 2. Manually scroll to the section
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2.5 group cursor-pointer">
          <img id="site-header-logo" src={SCPC_LOGO_URL} alt="SCPC logo" width={44} height={44} />
          <span className="sr-only">SCPC</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href="/" // Shows '/' on hover (clean), but we intercept the click below
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Section - CTA */}
        <div className="flex items-center gap-2">
          {/* Register Button */}
          <a
            id="site-register"
            href="/"
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            <Button size="sm" className="rounded-lg bg-[#f97316] px-5 text-white shadow-md hover:bg-[#e55f10] active:scale-[0.98] transition-all duration-200">
              Register
            </Button>
          </a>

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
                <a
                  key={link.id}
                  href="/"
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors block"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-gray-200 my-2" />

              <a
                href="/"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="block"
              >
                <Button className="w-full bg-[#f97316] text-white hover:bg-[#e55f10] active:scale-[0.98] transition-all duration-200">
                  Register
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}