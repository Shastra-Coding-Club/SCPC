'use client'

import React from 'react'
import { motion } from 'framer-motion'

/* =======================
   Prize Data
======================= */

interface Prize {
  position: string
  title: string
  amount: string
  description: string
  perks: string[]
  accent: string
  filename: string
  scale: string
}

const prizes: Prize[] = [
  {
    position: '1st',
    title: 'First Prize',
    amount: '₹25,000',
    description: 'Champion Team',
    perks: ['Trophy', 'Certificate', 'Goodies', 'Swag Kit'],
    accent: '#F59E0B', // strong gold
    filename: 'first_prize.cpp',
    scale: 'scale-110',
  },
  {
    position: '2nd',
    title: 'Second Prize',
    amount: '₹15,000',
    description: 'Runner Up',
    perks: ['Trophy', 'Certificate', 'Goodies', 'Swag Kit'],
    accent: '#64748B', // darker silver
    filename: 'second_prize.cpp',
    scale: 'scale-95',
  },
  {
    position: '3rd',
    title: 'Third Prize',
    amount: '₹5,000',
    description: 'Second Runner Up',
    perks: ['Trophy', 'Certificate', 'Goodies', 'Swag Kit'],
    accent: '#B45309', // darker bronze
    filename: 'third_prize.cpp',
    scale: 'scale-95',
  },
]

/* =======================
   Prize Card
======================= */

interface PrizeCardProps {
  data: Prize
  index: number
}

const PrizeCard: React.FC<PrizeCardProps> = ({ data, index }) => {
  const { position, title, amount, description, perks, accent, filename, scale } = data

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className={`w-[85vw] max-w-[300px] sm:w-[300px] md:w-[320px] lg:w-[340px] shrink-0 lg:${scale}`}
    >
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-[#1e1e1e] px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {filename}
          </span>

          <span
            className="px-2 py-0.5 text-xs font-bold rounded-md"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >
            {position}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <div className="font-mono text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
              const prize =
            </div>
            <div
              className="font-black tracking-tight text-4xl sm:text-5xl"
              style={{ color: accent }}
            >
              {amount}
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-mono text-xs sm:text-sm mb-4 sm:mb-6">
            // {description}
          </p>

          {/* Perks */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-3 sm:p-4 border dark:border-gray-700">
            <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-2">
              perks[] = {'{'}
            </div>

            <div className="space-y-1.5 sm:space-y-2 pl-3 sm:pl-4">
              {perks.map((perk, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="font-mono text-xs text-gray-400">
                    {i}:</span>
                  <span
                    className="px-2 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300"
                    style={{
                      backgroundColor: `${accent}15`,
                    }}
                  >
                    "{perk}"
                  </span>
                </div>
              ))}
            </div>

            <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-2">{'}'}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* =======================
   Main Section
======================= */

export function CardsParallax() {
  return (
    <section id="prizes" className="bg-gray-50 dark:bg-[#0f0f0f] py-24 transition-colors duration-300 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-20 px-4">
        <span className="font-mono text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1a1a] px-3 py-1 rounded border dark:border-gray-700">
          // prizes = [25000, 15000, 5000]
        </span>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mt-6">
          Prize Pool
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mt-4">
          Stand out. Solve hard. Win big.
        </p>
      </div>

      {/* Podium */}
      <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-center items-center md:items-end gap-6 lg:gap-8 px-4 overflow-x-hidden">
        {prizes.map((prize, index) => (
          <PrizeCard key={index} data={prize} index={index} />
        ))}
      </div>

      {/* Everyone Wins */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-24 px-4"
      >
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 border dark:border-gray-700 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-2">
              // everyone.wins()
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              All participants receive certificates & mementos
            </div>
          </div>

          <a
            href="https://unstop.com/p/tcet-shastras-competitive-programming-competition-2026-thakur-college-of-engineering-and-technology-tcet-mumbai-1631441"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md"
          >
            Register Now
          </a>
        </div>
      </motion.div>
    </section>
  )
}
