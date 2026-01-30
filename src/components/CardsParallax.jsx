'use client'

import React from 'react'
import { motion } from 'framer-motion'

/* =======================
   Prize Data
======================= */

const prizes = [
  {
    position: '2nd',
    title: 'Second Prize',
    amount: '₹20,000',
    description: 'Runner Up',
    perks: ['Trophy', 'Certificate', 'Mentorship', 'Swag Kit'],
    accent: '#64748B', // darker silver
    filename: 'second_prize.cpp',
    scale: 'scale-95',
  },
  {
    position: '1st',
    title: 'First Prize',
    amount: '₹30,000',
    description: 'Champion Team',
    perks: ['Trophy', 'Certificate', 'Internship Offer', 'Swag Kit'],
    accent: '#F59E0B', // strong gold
    filename: 'first_prize.cpp',
    scale: 'scale-110',
  },
  {
    position: '3rd',
    title: 'Third Prize',
    amount: '₹10,000',
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

const PrizeCard = ({ data, index }) => {
  const { position, title, amount, description, perks, accent, filename, scale } = data

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className={`w-[320px] md:w-[360px] ${scale}`}
    >
      <div className="bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-4 py-3 border-b flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          <span className="text-xs font-mono text-gray-600">
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
        <div className="p-6">
          <div className="mb-4">
            <div className="font-mono text-sm text-gray-500 mb-1">
              const prize =
            </div>
            <div
              className="font-black tracking-tight"
              style={{
                color: accent,
                fontSize: position === '1st' ? '3.5rem' : '3rem',
              }}
            >
              {amount}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900">
            {title}
          </h3>
          <p className="text-gray-600 font-mono text-sm mb-6">
            // {description}
          </p>

          {/* Perks */}
          <div className="bg-gray-50 rounded-xl p-4 border">
            <div className="font-mono text-xs text-gray-500 mb-2">
              perks[] = {'{'}
            </div>

            <div className="space-y-2 pl-4">
              {perks.map((perk, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="font-mono text-xs text-gray-400">
                    {i}:
                  </span>
                  <span
                    className="px-2 py-1 rounded text-sm font-medium"
                    style={{
                      backgroundColor: `${accent}15`,
                      color: '#111827',
                    }}
                  >
                    "{perk}"
                  </span>
                </div>
              ))}
            </div>

            <div className="font-mono text-xs text-gray-500 mt-2">{'}'}</div>
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
    <section id="prizes" className="bg-gray-50 py-24">
      {/* Header */}
      <div className="text-center mb-20 px-4">
        <span className="font-mono text-sm text-gray-500 bg-white px-3 py-1 rounded border">
          // prizes = [30000, 20000, 10000]
        </span>

        <h2 className="text-5xl font-extrabold text-gray-900 mt-6">
          Prize Pool
        </h2>

        <p className="text-gray-600 text-lg mt-4">
          Stand out. Solve hard. Win big.
        </p>
      </div>

      {/* Podium */}
      <div className="flex justify-center items-end gap-10 px-4">
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
        <div className="bg-white rounded-2xl p-8 border shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-xs text-blue-600 mb-2">
              // everyone.wins()
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">
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
