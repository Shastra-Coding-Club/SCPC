"use client"

import { Button } from "@/components/ui/button"
import { m } from "framer-motion"
import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { SCPC_LOGO_URL } from "@/lib/constants"

export function Hero() {
  const [copied, setCopied] = useState(false)

  const registrationCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TCET SHASTRA 2026 - Event Details
    string eventName = "TCET SHASTRA";
    string tagline = "Caliber Isn't Claimed; It's Conquered";
    string date = "13 March 2026";
    string startTime = "8:30 AM";
    int durationHours = 12;
    string location = "TCET, Kandivali (E), Mumbai";
    string college = "Thakur College of Engineering & Technology";
    int prizePool = 60000;

    cout << "Event: " << eventName << '\\n'
         << "Tagline: " << tagline << '\\n'
         << "Date: " << date << '\\n'
         << "Start Time: " << startTime << '\\n'
         << "Duration: " << durationHours << " Hours" << '\\n'
         << "Location: " << location << '\\n'
         << "College: " << college << '\\n'
         << "Prize Pool: ₹" << prizePool << '\\n';

    // Registration input (example)
    string teamName;
    string leaderEmail;
    int members;
    string track;

    // cin >> teamName >> leaderEmail >> members >> track;

    return 0;
}`;


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
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f] pt-20 pb-12 overflow-hidden transition-colors duration-300">
      {/* Decorative background logo (watermark - centered) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('${SCPC_LOGO_URL}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '35%',
          opacity: 0.22,
        }}
      />

      {/* Main glassmorphic container with watermark visible behind */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white/8 dark:bg-[#1a1a1a]/80 backdrop-blur-sm border border-black/20 dark:border-white/20 rounded-2xl p-5 md:p-6">
          {/* Main Content */}
          <div className="grid xl:grid-cols-2 gap-8 xl:gap-12 items-stretch">
            {/* Left Section - Problem Description */}
            <m.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Problem Description</h2>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  SCPC — TCET SHASTRA 2026 is a 12-hour competitive programming hackathon at Thakur College of Engineering & Technology, Mumbai.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-3">Input Format</h3>
                <div className="bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Event parameters (short):</p>
                  <ul className="text-sm space-y-2">
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">Duration</span> – 12 Hours
                    </li>
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">Team Size</span> – 1-3 members
                    </li>
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">Mode</span> – Hybrid
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-3">Output Format</h3>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Prizes</p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                    <li>1st Prize: ₹30,000 + Trophy</li>
                    <li>2nd Prize: ₹20,000 + Trophy</li>
                    <li>3rd Prize: ₹10,000 + Trophy</li>
                    <li className="pt-1 border-t border-green-100 dark:border-green-800"><strong>Total:</strong> ₹60,000</li>
                  </ul>
                </div>
              </div>
            </m.div>

            {/* Right Section - Event Detail */}
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4 flex flex-col"
            >
              <h2 className="text-3xl font-bold text-black dark:text-white">Event Detail</h2>

              {/* Code Editor Box */}
              <div className="bg-white/40 dark:bg-[#1a1a1a]/80 backdrop-blur-sm border border-black/20 dark:border-white/20 rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-100 dark:bg-[#1e1e1e] px-4 py-3 border-b-2 border-gray-300 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Language:</span>
                    <span className="text-sm font-semibold text-black dark:text-white">eventDetails.cpp</span>
                  </div>
                  <m.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border border-gray-400 dark:border-gray-600 text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-black dark:text-white" />
                        <span className="text-xs text-black dark:text-white font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-black dark:text-white" />
                        <span className="text-xs text-black dark:text-white font-semibold">Copy</span>
                      </>
                    )}
                  </m.button>
                </div>

                {/* Code Content */}
                <div className="bg-white/30 dark:bg-[#0f0f0f] p-4 min-h-64 max-h-80 overflow-y-auto font-mono text-sm flex-1">
                  {registrationCode.split('\n').map((line, idx) => (
                    <div key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-1 transition-colors leading-relaxed">
                      <span className="text-gray-400 mr-3 inline-block w-8 text-right">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="text-gray-500 dark:text-gray-400">{line}</span>
                    </div>
                  ))}
                </div>

                {/* Footer with Status */}
                <div className="px-4 py-3 border-t-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#1e1e1e] flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Ready</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">Lines: {registrationCode.split('\n').length} | Chars: {registrationCode.length}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a id="hero-register" href="https://unstop.com/o/gc8MVwn?lb=EPXO7qEG&utm_medium=Share&utm_source=tcetcod19106&utm_campaign=Online_coding_challenge" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="w-full bg-[#f97316] text-white hover:bg-[#e55f10]">
                    Register Now
                  </Button>
                </a>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Press Ctrl + Enter to submit</p>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  )
}
