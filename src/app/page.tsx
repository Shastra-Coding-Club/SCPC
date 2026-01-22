"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Timeline } from "@/components/Timeline"
import { TeamTree } from "@/components/TeamTree"
import { Prizes } from "@/components/Prizes"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"
import { Loader } from "@/components/Loader"

export default function Home() {
  const [showLoader, setShowLoader] = useState(true)
  const appReadyPromiseRef = useRef<Promise<void> | null>(null)
  const resolveReadyRef = useRef<(() => void) | null>(null)

  // Create appReadyPromise on mount
  useEffect(() => {
    appReadyPromiseRef.current = new Promise<void>((resolve) => {
      resolveReadyRef.current = resolve
    })

    // Expose globally for external access
    window.APP_READY_PROMISE = appReadyPromiseRef.current

    // Signal ready after fonts and critical resources load
    const signalReady = async () => {
      try {
        // Wait for fonts to load (with fallback timeout)
        await Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 2000))
        ])
      } finally {
        resolveReadyRef.current?.()
      }
    }

    signalReady()

    return () => {
      delete window.APP_READY_PROMISE
    }
  }, [])

  // Handler when loader finishes
  const handleLoaderFinish = () => {
    setShowLoader(false)
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {showLoader && (
        <Loader
          appReadyPromise={appReadyPromiseRef.current}
          timeout={10000}
          minDurationMs={2500}
          onFinish={handleLoaderFinish}
        />
      )}
      <Navbar />
      <Hero />
      <About />
      <TeamTree />
      <Timeline />
      <Prizes />
      <Contact />
      <Footer />
    </div>
  )
}
