"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"

export function Hero() {
  const [copied, setCopied] = useState(false)

  const registrationCode = `/*
 * TCET SHASTRA 2026 - Event Details
 * -------------------------------
 * name: "TCET SHASTRA"
 * tagline: "Caliber Isn't Claimed; It's Conquered"
 * date: "15 January 2026"
 * startTime: "9:00 AM"
 * duration: "12 Hours"
 * location: "TCET, Kandivali (E), Mumbai"
 * college: "Thakur College of Engineering & Technology"
 * prizePool: "₹90,000"
 */

// Registration template (for reference)
// team_name = "YourTeam"
// leader_email = "leader@email.com"
// members = ["Name1", "Name2"]
// track = "Web Dev"
// college = "Your College"`

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        const registerLink = document.querySelector('a#hero-register') as HTMLAnchorElement
        if (registerLink) {
          registerLink.click()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white pt-24 pb-12 overflow-hidden">
      {/* Decorative background logo (watermark - centered) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/scpc.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '35%',
          opacity: 0.22,
        }}
      />

      {/* Main glassmorphic container with watermark visible behind */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white/8 backdrop-blur-sm border border-black/20 rounded-2xl p-8">
        {/* Main Content */}
        <div className="flex flex-col gap-16">
          {/* Left Section - Problem Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-black mb-4">Problem Description</h2>
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                SCPC — TCET SHASTRA 2026 is a 12-hour competitive programming hackathon at Thakur College of Engineering & Technology, Mumbai. Teams of 2–4 will solve real problems, showcase solutions, and compete for cash prizes and recognition.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-3">Input Format</h3>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-700 font-semibold">Event parameters (short):</p>
                <ul className="text-sm space-y-2">
                  <li className="text-gray-700">
                    <span className="text-blue-600 font-semibold">Duration</span> – 12 Hours
                  </li>
                  <li className="text-gray-700">
                    <span className="text-blue-600 font-semibold">Team Size</span> – 2–4 members
                  </li>
                  <li className="text-gray-700">
                    <span className="text-blue-600 font-semibold">Mode</span> – Online Hackathon
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-3">Output Format</h3>
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm font-semibold text-gray-800">Prizes</p>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>1st Prize: ₹45,000 + Trophy</li>
                  <li>2nd Prize: ₹30,000 + Trophy</li>
                  <li>3rd Prize: ₹15,000 + Trophy</li>
                  <li className="pt-1 border-t border-green-100"><strong>Total:</strong> ₹90,000</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right Section - Event Detail */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 flex flex-col"
          >
            <h2 className="text-3xl font-bold text-black">Event Detail</h2>
            
            {/* Code Editor Box */}
            <div className="bg-white/40 backdrop-blur-sm border border-black/20 rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-100 px-4 py-3 border-b-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-semibold">Language:</span>
                  <span className="text-sm font-semibold text-black">eventDetails.cpp</span>
                </div>
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors border border-black text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span className="text-xs text-black font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span className="text-xs text-black font-semibold">Copy</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Code Content */}
              <div className="bg-white/30 p-4 min-h-80 max-h-96 overflow-y-auto font-mono text-sm flex-1">
                {registrationCode.split('\n').map((line, idx) => (
                  <div key={idx} className="hover:bg-gray-50 px-2 py-1 transition-colors leading-relaxed">
                    <span className="text-gray-400 mr-3 inline-block w-8 text-right">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-gray-500">{line}</span>
                  </div>
                ))}
              </div>

              {/* Footer with Status */}
              <div className="px-4 py-3 border-t-2 border-black bg-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-600 font-semibold">Ready</span>
                <span className="text-xs text-gray-500">Lines: {registrationCode.split('\n').length} | Chars: {registrationCode.length}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <a id="hero-register" href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="w-full bg-[#f97316] text-white hover:bg-[#e55f10]">
                  Register Now
                </Button>
              </a>
            </div>

            <p className="text-xs text-gray-500 text-center">Press Ctrl + Enter to submit</p>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  )
}
