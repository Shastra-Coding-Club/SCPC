"use client"

import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Timeline } from "@/components/Timeline"
import { TeamTree } from "@/components/TeamTree"
import { Prizes } from "@/components/Prizes"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
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
