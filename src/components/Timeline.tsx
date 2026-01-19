"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function Timeline() {
  const scheduleItems = [
    {
      time: "9:00 AM",
      title: "Registration Opens",
      description: "Team registration and welcome breakfast",
      type: "start"
    },
    {
      time: "9:30 AM",
      title: "Opening Ceremony",
      description: "Keynote address and event briefing",
      type: "event"
    },
    {
      time: "10:00 AM",
      title: "Contest Begins",
      description: "Problem statements released, coding starts",
      type: "start"
    },
    {
      time: "1:00 PM",
      title: "Lunch Break",
      description: "Refreshments and team discussion time",
      type: "break"
    },
    {
      time: "2:00 PM",
      title: "Mid-Event Check-in",
      description: "Progress evaluation and mentoring",
      type: "event"
    },
    {
      time: "6:00 PM",
      title: "Evening Snacks",
      description: "Energy boost for the final stretch",
      type: "break"
    },
    {
      time: "9:00 PM",
      title: "Submission Deadline",
      description: "Code submission and project demonstration",
      type: "deadline"
    },
    {
      time: "9:30 PM",
      title: "Judging Round",
      description: "Teams present to industry experts",
      type: "event"
    },
    {
      time: "10:30 PM",
      title: "Results & Awards",
      description: "Winner announcement and prize distribution",
      type: "end"
    }
  ]

  const [mode, setMode] = useState<'stack' | 'queue'>('stack')
  const [modeKey, setModeKey] = useState(0)
  const [structure, setStructure] = useState<number[]>([])

  useEffect(() => {
    // run the sequence on mode change / key change; update `structure` with indices
    let running = true
    setStructure([])

    const timers: number[] = []

    scheduleItems.forEach((it, i) => {
      const t = window.setTimeout(() => {
        if (!running) return

        // push behavior
        setStructure((prev) => (mode === 'stack' ? [i, ...prev] : [...prev, i]))

        // if this item signals a removal (deadline/end), remove according to DS semantics
        if (it.type === 'deadline' || it.type === 'end') {
          // small delay before pop to let push animate
          const popTimer = window.setTimeout(() => {
            if (!running) return
            setStructure((prev) => prev.slice(1))
          }, 500)
          timers.push(popTimer)
        }
      }, i * 900)

      timers.push(t)
    })

    return () => {
      running = false
      timers.forEach((tt) => clearTimeout(tt))
    }
  }, [mode, modeKey])

  return (
    <section id="timeline" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-black mb-4">Event Timeline</h2>
          <p className="text-lg text-gray-600">15 January 2026 - A Day of Innovation</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => { setMode('stack'); setModeKey((k) => k + 1) }}
              className={`px-4 py-2 rounded-md font-semibold ${mode === 'stack' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Stack
            </button>
            <button
              onClick={() => { setMode('queue'); setModeKey((k) => k + 1) }}
              className={`px-4 py-2 rounded-md font-semibold ${mode === 'queue' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Queue
            </button>
          </div>
        </motion.div>

        {/* Tree diagram moved to a separate component (`TeamTree`) rendered on the page */}

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-orange-500"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {scheduleItems.map((item, index) => {
              const pos = structure.indexOf(index)
              const inStructure = pos !== -1

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      animate={inStructure ? { scale: 1.03, y: -6 } : { scale: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`relative bg-white border-2 rounded-lg p-6 shadow-lg ${inStructure ? 'border-black bg-yellow-50' : 'border-black'}`}
                    >
                      <div className="text-sm font-bold text-blue-600 uppercase tracking-wide">{item.time}</div>
                      <h3 className="text-lg font-bold text-black mt-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                      {inStructure && (
                        <div className="absolute -top-3 right-3">
                          <div className="inline-flex items-center justify-center px-2 py-1 bg-black text-white text-xs rounded-md">#{pos + 1}</div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="flex justify-center relative">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      animate={inStructure ? { scale: 1.4 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`w-5 h-5 rounded-full border-4 border-white relative z-10 ${
                        item.type === 'start'
                          ? 'bg-green-500'
                          : item.type === 'end'
                          ? 'bg-red-500'
                          : item.type === 'deadline'
                          ? 'bg-orange-500'
                          : item.type === 'break'
                          ? 'bg-gray-400'
                          : 'bg-blue-600'
                      }`}
                    />

                    {inStructure && (
                      <div className="absolute -right-6 -top-1 text-xs text-gray-700">{mode.toUpperCase()}</div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
        
        {/* (Visualizer cards removed — animation now runs inline within the timeline) */}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 bg-gray-50 border-2 border-black rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-black mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-700">Event</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-700">Break</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-700">Deadline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700">End</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// visualizer components removed — timeline items animate directly now
