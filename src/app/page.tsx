"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Loader } from "@/components/Loader"

// Lazy load below-the-fold components for faster initial load
const About = dynamic(() => import("@/components/About").then(mod => ({ default: mod.About })), {
  loading: () => <div className="min-h-screen bg-gray-50 animate-pulse" />,
  ssr: true
})

const SponsorsStrip = dynamic(() => import("@/components/SponsorsStrip").then(mod => ({ default: mod.SponsorsStrip })), {
  loading: () => <div className="h-48 bg-white animate-pulse" />,
  ssr: true
})

const TeamTree = dynamic(() => import("@/components/TeamTree").then(mod => ({ default: mod.TeamTree })), {
  loading: () => <div className="min-h-screen bg-white animate-pulse" />,
  ssr: true
})

const Timeline = dynamic(() => import("@/components/Timeline").then(mod => ({ default: mod.Timeline })), {
  loading: () => <div className="min-h-screen bg-white animate-pulse" />,
  ssr: true
})

const CardsParallax = dynamic(() => import("@/components/CardsParallax").then(mod => ({ default: mod.CardsParallax })), {
  loading: () => <div className="min-h-screen bg-gray-50 animate-pulse" />,
  ssr: true
})

const FAQ = dynamic(() => import("@/components/FAQ").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="min-h-screen bg-gray-50 animate-pulse" />,
  ssr: true
})

const Contact = dynamic(() => import("@/components/Contact").then(mod => ({ default: mod.Contact })), {
  loading: () => <div className="min-h-screen bg-white animate-pulse" />,
  ssr: true
})

const Footer = dynamic(() => import("@/components/Footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-20 bg-gray-100 animate-pulse" />,
  ssr: true
})

export default function Home() {
  const [showLoader, setShowLoader] = useState(true)
  const appReadyPromiseRef = useRef<Promise<void> | null>(null)
  const resolveReadyRef = useRef<(() => void) | null>(null)

  // Create appReadyPromise on mount
  useEffect(() => {
    appReadyPromiseRef.current = new Promise<void>((resolve) => {
      resolveReadyRef.current = resolve
    })

    // Signal ready after fonts and critical resources load
    const signalReady = async () => {
      try {
        // Wait for fonts to load (with fallback timeout)
        await Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 1500))
        ])
      } finally {
        resolveReadyRef.current?.()
      }
    }

    signalReady()

    return () => {
      // Cleanup if needed
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
          minDurationMs={3000}
          onFinish={handleLoaderFinish}
        />
      )}

      {/* Critical above-the-fold content - loaded immediately */}
      <Navbar />
      <Hero />

      {/* Lazy loaded content - loaded as user scrolls */}
      <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
        <About />
      </Suspense>

      <Suspense fallback={<div className="h-48 bg-white animate-pulse" />}>
        <SponsorsStrip />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
        <TeamTree />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
        <Timeline />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
        <CardsParallax />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
        <Contact />
      </Suspense>

      <Suspense fallback={<div className="h-20 bg-gray-100 animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  )
}