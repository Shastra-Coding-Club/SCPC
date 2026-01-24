"use client";

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Linkedin, Twitter, Globe, User, AtSign, FileText, MessageSquare, Send, RotateCcw, Play } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

// Form fields as linked list nodes
const formNodes = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    icon: User,
    required: true
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "your@email.com",
    icon: AtSign,
    required: true
  },
  {
    id: "subject",
    label: "Subject",
    type: "text",
    placeholder: "What's this about?",
    icon: FileText,
    required: true
  },
  {
    id: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Your message here...",
    icon: MessageSquare,
    required: true
  }
]

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [visibleNodes, setVisibleNodes] = useState<number[]>([])
  const [currentNode, setCurrentNode] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const hasStartedRef = useRef(false)

  // Start animation
  const startAnimation = useCallback(() => {
    setVisibleNodes([])
    setCurrentNode(-1)
    setIsAnimating(true)
    setIsComplete(false)
    hasStartedRef.current = true
  }, [])

  // Reset animation
  const resetAnimation = useCallback(() => {
    setVisibleNodes([])
    setCurrentNode(-1)
    setIsAnimating(false)
    setIsComplete(false)
    hasStartedRef.current = false
  }, [])

  // Animation logic - reveal nodes one by one
  useEffect(() => {
    if (!isAnimating) return

    let running = true
    const timers: number[] = []

    formNodes.forEach((_, i) => {
      const t = window.setTimeout(() => {
        if (!running) return

        setCurrentNode(i)
        setVisibleNodes(prev => [...prev, i])
      }, i * 500 + 300)

      timers.push(t)
    })

    // Mark complete
    const completeTimer = window.setTimeout(() => {
      if (running) {
        setIsAnimating(false)
        setIsComplete(true)
      }
    }, formNodes.length * 500 + 800)
    timers.push(completeTimer)

    return () => {
      running = false
      timers.forEach(t => clearTimeout(t))
    }
  }, [isAnimating])

  // Auto-start on scroll into view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedRef.current) {
          startAnimation()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [startAnimation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  return (
    <section id="contact" ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-black mb-4">Linked with Us!!</h2>
          <p className="text-lg text-gray-600 mb-6">Have questions? Traverse our contact form!</p>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isAnimating
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              <Play className="w-4 h-4" />
              {isAnimating ? 'Building List...' : 'Replay'}
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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Linked List Form */}
          <div className="relative">
            {/* Head pointer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: visibleNodes.length > 0 ? 1 : 0.3, x: 0 }}
              className="mb-4 flex items-center gap-2"
            >
              <span className="font-mono text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                HEAD
              </span>
              <div className="w-8 h-0.5 bg-blue-400"></div>
              <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-blue-400"></div>
            </motion.div>

            {/* Form as Linked List */}
            <form onSubmit={handleSubmit} className="space-y-0">
              <AnimatePresence mode="popLayout">
                {formNodes.map((node, index) => {
                  const isVisible = visibleNodes.includes(index)
                  const isCurrent = currentNode === index
                  const Icon = node.icon
                  const isLast = index === formNodes.length - 1

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -50, scale: 0.9 }}
                      animate={{
                        opacity: isVisible ? 1 : 0.2,
                        x: isVisible ? 0 : -30,
                        scale: isVisible ? 1 : 0.95
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="relative"
                    >
                      {/* Node Container */}
                      <div className={`relative transition-all duration-300 ${isCurrent ? 'transform -translate-y-1' : ''}`}>
                        {/* Current pointer */}
                        <AnimatePresence>
                          {isCurrent && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="absolute -left-20 top-1/2 -translate-y-1/2 flex items-center gap-1"
                            >
                              <span className="font-mono text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                                curr
                              </span>
                              <div className="w-3 h-0.5 bg-orange-400"></div>
                              <div className="w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-orange-400"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Node Box */}
                        <div className={`bg-white border-2 rounded-lg p-5 transition-all duration-300 ${isCurrent ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' :
                          isVisible ? 'border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'border-gray-200'
                          }`}>
                          {/* Node Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${isCurrent ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              <Icon className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-bold text-black">
                                {node.label}
                                {node.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              <span className="font-mono text-xs text-gray-400">node[{index}].data</span>
                            </div>
                            {/* Node address */}
                            <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                              0x{(1000 + index * 4).toString(16)}
                            </span>
                          </div>

                          {/* Input Field */}
                          {node.type === "textarea" ? (
                            <textarea
                              value={formData[node.id as keyof typeof formData]}
                              onChange={(e) => handleInputChange(node.id, e.target.value)}
                              placeholder={node.placeholder}
                              rows={3}
                              disabled={!isVisible}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                              required={node.required}
                            />
                          ) : (
                            <input
                              type={node.type}
                              value={formData[node.id as keyof typeof formData]}
                              onChange={(e) => handleInputChange(node.id, e.target.value)}
                              placeholder={node.placeholder}
                              disabled={!isVisible}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                              required={node.required}
                            />
                          )}
                        </div>

                        {/* Link to next node (pointer arrow) */}
                        {!isLast && (
                          <motion.div
                            className="flex justify-center py-2"
                            animate={{ opacity: isVisible ? 1 : 0.2 }}
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-0.5 h-4 bg-gray-300"></div>
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-[10px] text-gray-400">next</span>
                              </div>
                              <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-gray-400"></div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* NULL terminator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isComplete ? 1 : 0.2 }}
                className="flex justify-center pt-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-gray-300"></div>
                  <div className="font-mono text-sm text-red-500 bg-red-50 px-4 py-2 rounded border border-red-200">
                    NULL
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isComplete ? 1 : 0.3, y: isComplete ? 0 : 10 }}
                className="pt-6"
              >
                <Button
                  type="submit"
                  disabled={!isComplete}
                  className="w-full bg-orange-500 text-white hover:bg-orange-600 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  list.submit()
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Right Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Linked List Visualizer */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-bold text-gray-900">
                  LinkedList&lt;FormField&gt;
                </span>
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                  size: {visibleNodes.length}
                </span>
              </div>

              {/* Visual representation */}
              <div className="space-y-2 min-h-[200px]">
                <AnimatePresence mode="popLayout">
                  {visibleNodes.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 text-sm font-mono py-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
                    >
                      // Empty list
                      <br />
                      // Waiting for append()...
                    </motion.div>
                  ) : (
                    visibleNodes.map((nodeIndex, pos) => (
                      <motion.div
                        key={nodeIndex}
                        layout
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`p-3 rounded-lg border-2 font-mono text-sm bg-blue-50 border-blue-300 text-blue-900 ${pos === visibleNodes.length - 1 ? 'ring-2 ring-offset-1 ring-blue-400' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-500">[{pos}]</span>
                          <span className="font-bold">{formNodes[nodeIndex].label}</span>
                          <span className="text-xs text-blue-400">→</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Code Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="font-mono text-xs bg-gray-900 text-gray-300 p-3 rounded-lg">
                  <div className="text-green-400">// Last operation:</div>
                  {currentNode >= 0 ? (
                    <div className="text-blue-300">
                      list.append(
                      <span className="text-orange-300">"{formNodes[currentNode]?.label}"</span>
                      )
                    </div>
                  ) : (
                    <div className="text-gray-500">// No operations yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 border-2 border-black rounded-lg p-6">
              <h3 className="text-2xl font-bold text-black mb-6">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-black">Email</p>
                    <p className="text-gray-600">shastra@tcet.edu.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-black">Website</p>
                    <p className="text-gray-600">www.tcet.edu.in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 border-2 border-black rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
