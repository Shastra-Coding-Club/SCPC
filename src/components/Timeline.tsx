"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef, useCallback } from "react"
import { Play, RotateCcw, Layers, ListOrdered } from "lucide-react"

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
  const [structure, setStructure] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const sectionRef = useRef<HTMLElement>(null)
  const hasStartedRef = useRef(false)

  // Reset and start animation
  const startAnimation = useCallback(() => {
    setStructure([])
    setCurrentStep(-1)
    setIsPlaying(true)
    hasStartedRef.current = true
  }, [])

  // Reset animation
  const resetAnimation = useCallback(() => {
    setStructure([])
    setCurrentStep(-1)
    setIsPlaying(false)
    hasStartedRef.current = false
  }, [])

  // Switch mode and autoplay
  const switchMode = useCallback((newMode: 'stack' | 'queue') => {
    setMode(newMode)
    setStructure([])
    setCurrentStep(-1)
    // Auto-start the animation when switching modes
    setTimeout(() => {
      setIsPlaying(true)
      hasStartedRef.current = true
    }, 100)
  }, [])

  // Animation logic
  useEffect(() => {
    if (!isPlaying) return

    let running = true
    const timers: number[] = []

    scheduleItems.forEach((_, i) => {
      const t = window.setTimeout(() => {
        if (!running) return
        
        setCurrentStep(i)
        
        // Push to structure based on mode
        setStructure((prev) => {
          if (mode === 'stack') {
            // Stack: add to top (beginning of array for visual)
            return [i, ...prev]
          } else {
            // Queue: add to back (end of array)
            return [...prev, i]
          }
        })
      }, i * 600)

      timers.push(t)
    })

    // Mark as complete after all items
    const completeTimer = window.setTimeout(() => {
      if (running) {
        setIsPlaying(false)
      }
    }, scheduleItems.length * 600 + 500)
    timers.push(completeTimer)

    return () => {
      running = false
      timers.forEach((tt) => clearTimeout(tt))
    }
  }, [isPlaying, mode, scheduleItems.length])

  // Intersection Observer to auto-start on first view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedRef.current) {
          startAnimation()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [startAnimation])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'start': return 'bg-green-500'
      case 'end': return 'bg-red-500'
      case 'deadline': return 'bg-orange-500'
      case 'break': return 'bg-gray-400'
      default: return 'bg-blue-600'
    }
  }

  return (
    <section id="timeline" ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-black mb-4">Event Timeline</h2>
          <p className="text-lg text-gray-600 mb-6">15 January 2026 - A Day of Innovation</p>
          
          {/* Data Structure Controls */}
          <div className="inline-flex items-center gap-2 p-2 bg-gray-100 rounded-xl">
            <button
              onClick={() => switchMode('stack')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                mode === 'stack' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Stack (LIFO)
            </button>
            <button
              onClick={() => switchMode('queue')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                mode === 'queue' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              Queue (FIFO)
            </button>
          </div>

          {/* Playback Controls */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={startAnimation}
              disabled={isPlaying}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isPlaying 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <Play className="w-4 h-4" />
              {isPlaying ? 'Playing...' : 'Play'}
            </button>
            <button
              onClick={resetAnimation}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline - Left/Center */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Center Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-orange-500"></div>

              {/* Timeline Items */}
              <div className="space-y-8">
                {scheduleItems.map((item, index) => {
                  const isInStructure = structure.includes(index)
                  const isCurrent = currentStep === index

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0.3 }}
                      animate={{ 
                        opacity: isInStructure ? 1 : 0.4,
                        scale: isCurrent ? 1.02 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Content */}
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                        <motion.div
                          animate={{
                            borderColor: isInStructure ? (mode === 'stack' ? '#2563eb' : '#f97316') : '#000',
                            backgroundColor: isCurrent ? (mode === 'stack' ? '#eff6ff' : '#fff7ed') : '#fff',
                            y: isCurrent ? -4 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="relative bg-white border-2 border-black rounded-lg p-4 shadow-md"
                        >
                          <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">{item.time}</div>
                          <h3 className="text-base font-bold text-black mt-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          
                          {/* Position indicator */}
                          <AnimatePresence>
                            {isInStructure && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className={`absolute -top-2 ${index % 2 === 0 ? 'left-3' : 'right-3'} px-2 py-0.5 rounded text-xs font-bold text-white ${
                                  mode === 'stack' ? 'bg-blue-600' : 'bg-orange-500'
                                }`}
                              >
                                #{structure.indexOf(index) + 1}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>

                      {/* Timeline Dot */}
                      <div className="flex justify-center relative z-10">
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.5 : isInStructure ? 1.2 : 1,
                            boxShadow: isCurrent ? '0 0 20px rgba(37, 99, 235, 0.5)' : 'none'
                          }}
                          transition={{ duration: 0.3 }}
                          className={`w-4 h-4 rounded-full border-4 border-white ${getTypeColor(item.type)}`}
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Data Structure Visualizer - Right */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-900 rounded-xl p-6 text-white shadow-xl">
                {/* Visualizer Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {mode === 'stack' ? (
                      <Layers className="w-5 h-5 text-blue-400" />
                    ) : (
                      <ListOrdered className="w-5 h-5 text-orange-400" />
                    )}
                    <span className="font-mono font-bold">
                      {mode === 'stack' ? 'Stack' : 'Queue'}&lt;Event&gt;
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    size: {structure.length}
                  </span>
                </div>

                {/* Visualizer Body */}
                <div className="space-y-2 min-h-[300px]">
                  {mode === 'stack' && (
                    <div className="text-xs text-gray-500 font-mono mb-2 flex items-center gap-2">
                      <span>↓ TOP (pop here)</span>
                    </div>
                  )}
                  
                  <AnimatePresence mode="popLayout">
                    {structure.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500 text-sm font-mono py-8 text-center"
                      >
                        // Empty {mode}
                        <br />
                        // Waiting for push()...
                      </motion.div>
                    ) : (
                      structure.map((itemIndex, pos) => (
                        <motion.div
                          key={itemIndex}
                          layout
                          initial={{ 
                            opacity: 0, 
                            x: mode === 'stack' ? -50 : 50,
                            scale: 0.8 
                          }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            scale: 1 
                          }}
                          exit={{ 
                            opacity: 0, 
                            x: mode === 'stack' ? 50 : -50,
                            scale: 0.8 
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className={`p-3 rounded-lg border-2 font-mono text-sm ${
                            mode === 'stack' 
                              ? 'bg-blue-900/50 border-blue-500' 
                              : 'bg-orange-900/50 border-orange-500'
                          } ${pos === 0 ? 'ring-2 ring-white/30' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">[{pos}]</span>
                            <span className="font-bold truncate ml-2">
                              {scheduleItems[itemIndex].title}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {scheduleItems[itemIndex].time}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>

                  {mode === 'queue' && structure.length > 0 && (
                    <div className="text-xs text-gray-500 font-mono mt-2 flex items-center gap-2">
                      <span>↑ BACK (enqueue here)</span>
                    </div>
                  )}
                </div>

                {/* Code Preview */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="font-mono text-xs text-gray-400">
                    <div className="text-green-400">// Last operation:</div>
                    {currentStep >= 0 ? (
                      <div className="text-blue-300">
                        {mode}.{mode === 'stack' ? 'push' : 'enqueue'}(
                        <span className="text-orange-300">"{scheduleItems[currentStep]?.title}"</span>
                        )
                      </div>
                    ) : (
                      <div className="text-gray-500">// No operations yet</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
                <h4 className="text-base font-bold text-gray-900 mb-3">Legend</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Start</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-600 shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Event</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gray-400 shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Break</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Deadline</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">End</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
