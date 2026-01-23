"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"
import { Play, RotateCcw, GitBranch, Layers, ChevronDown, HelpCircle } from "lucide-react"

// FAQ data - flat structure for cleaner display
const faqItems = [
    {
        id: "q1",
        category: "General",
        question: "What is TCET SHASTRA?",
        answer: "TCET SHASTRA is a 12-hour competitive programming hackathon organized by Thakur College of Engineering & Technology. It brings together coders from various colleges to solve algorithmic challenges."
    },
    {
        id: "q2",
        category: "General",
        question: "When and where is the event?",
        answer: "The event is scheduled for January 15, 2026 at TCET Campus, Kandivali (E), Mumbai. It starts at 9:00 AM and runs for 12 hours."
    },
    {
        id: "q3",
        category: "Registration",
        question: "How do I register?",
        answer: "You can register through our official registration portal. Click the 'Register Now' button on our website. Registration is open until slots are filled!"
    },
    {
        id: "q4",
        category: "Registration",
        question: "What's the team size?",
        answer: "Teams can have 2-4 members. All team members must register together. Solo participation is not allowed."
    },
    {
        id: "q5",
        category: "Prizes",
        question: "What are the prizes?",
        answer: "Total prize pool is ₹90,000+! 1st Prize: ₹45,000, 2nd Prize: ₹30,000, 3rd Prize: ₹15,000. Plus special category awards and goodies for all participants."
    },
    {
        id: "q6",
        category: "Technical",
        question: "What languages are allowed?",
        answer: "You can use C, C++, Java, Python, or JavaScript. The platform supports all major competitive programming languages."
    },
    {
        id: "q7",
        category: "Technical",
        question: "What's the problem difficulty?",
        answer: "Problems range from Easy to Hard with varying point values. Expect topics like DP, Graphs, Trees, and advanced data structures."
    },
    {
        id: "q8",
        category: "Prizes",
        question: "Are there participation certificates?",
        answer: "Yes! All participants receive certificates and mementos. Winners get trophies and additional recognition."
    }
]

// BFS order (by category groups)
function bfsOrder(): number[] {
    const categories = ["General", "Registration", "Prizes", "Technical"]
    const order: number[] = []
    categories.forEach(cat => {
        faqItems.forEach((item, idx) => {
            if (item.category === cat) order.push(idx)
        })
    })
    return order
}

// DFS order (sequential)
function dfsOrder(): number[] {
    return faqItems.map((_, idx) => idx)
}

export function FAQ() {
    const [mode, setMode] = useState<'bfs' | 'dfs'>('bfs')
    const [visitedNodes, setVisitedNodes] = useState<number[]>([])
    const [currentNode, setCurrentNode] = useState<number | null>(null)
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
    const [isAnimating, setIsAnimating] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)
    const hasStartedRef = useRef(false)

    const traversalOrder = mode === 'bfs' ? bfsOrder() : dfsOrder()

    const startAnimation = useCallback(() => {
        setVisitedNodes([])
        setCurrentNode(null)
        setExpandedNodes(new Set())
        setIsAnimating(true)
        hasStartedRef.current = true
    }, [])

    const resetAnimation = useCallback(() => {
        setVisitedNodes([])
        setCurrentNode(null)
        setExpandedNodes(new Set())
        setIsAnimating(false)
        hasStartedRef.current = false
    }, [])

    const switchMode = useCallback((newMode: 'bfs' | 'dfs') => {
        setMode(newMode)
        setVisitedNodes([])
        setCurrentNode(null)
        setExpandedNodes(new Set())
        setTimeout(() => {
            setIsAnimating(true)
            hasStartedRef.current = true
        }, 100)
    }, [])

    // Animation logic
    useEffect(() => {
        if (!isAnimating) return

        let running = true
        const timers: number[] = []

        traversalOrder.forEach((nodeIdx, i) => {
            const t = window.setTimeout(() => {
                if (!running) return
                setCurrentNode(nodeIdx)
                setVisitedNodes(prev => [...prev, nodeIdx])
            }, i * 350)
            timers.push(t)
        })

        const completeTimer = window.setTimeout(() => {
            if (running) {
                setIsAnimating(false)
                setCurrentNode(null)
            }
        }, traversalOrder.length * 350 + 400)
        timers.push(completeTimer)

        return () => {
            running = false
            timers.forEach(t => clearTimeout(t))
        }
    }, [isAnimating, traversalOrder])

    // Auto-start
    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStartedRef.current) {
                    startAnimation()
                }
            },
            { threshold: 0.15 }
        )

        observer.observe(section)
        return () => observer.disconnect()
    }, [startAnimation])

    const toggleExpand = (idx: number) => {
        setExpandedNodes(prev => {
            // Accordion: if clicking same one, close it. Otherwise open only this one.
            if (prev.has(idx)) {
                return new Set()
            } else {
                return new Set([idx])
            }
        })
    }

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case "General": return "bg-blue-100 text-blue-700 border-blue-200"
            case "Registration": return "bg-green-100 text-green-700 border-green-200"
            case "Prizes": return "bg-amber-100 text-amber-700 border-amber-200"
            case "Technical": return "bg-purple-100 text-purple-700 border-purple-200"
            default: return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    return (
        <section id="faq" ref={sectionRef} className="py-20 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <div className="inline-block mb-4">
                        <span className="font-mono text-sm text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
              // tree.traverse()
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Frequently Asked{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Questions
                        </span>
                    </h2>

                    <p className="text-gray-500 text-lg mb-8">
                        Explore our FAQ tree using graph traversal algorithms
                    </p>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Mode Toggle */}
                        <div className="inline-flex items-center p-1.5 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                            <button
                                onClick={() => switchMode('bfs')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === 'bfs'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Layers className="w-4 h-4" />
                                BFS
                            </button>
                            <button
                                onClick={() => switchMode('dfs')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === 'dfs'
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <GitBranch className="w-4 h-4" />
                                DFS
                            </button>
                        </div>

                        {/* Playback */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={startAnimation}
                                disabled={isAnimating}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${isAnimating
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                            >
                                <Play className="w-4 h-4" />
                                {isAnimating ? 'Traversing...' : 'Replay'}
                            </button>
                            <button
                                onClick={resetAnimation}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ Grid */}
                <div className="grid gap-4">
                    {faqItems.map((item, idx) => {
                        const isVisited = visitedNodes.includes(idx)
                        const isCurrent = currentNode === idx
                        const isExpanded = expandedNodes.has(idx)
                        const orderNum = visitedNodes.indexOf(idx)

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isVisited ? 1 : 0.4,
                                    y: 0,
                                    scale: isCurrent ? 1.01 : 1
                                }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                            >
                                <div
                                    className={`relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 cursor-pointer ${isCurrent
                                        ? 'border-blue-500 shadow-lg shadow-blue-100'
                                        : isVisited
                                            ? 'border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                            : 'border-gray-200'
                                        }`}
                                    onClick={() => isVisited && toggleExpand(idx)}
                                >
                                    {/* Order Badge */}
                                    <AnimatePresence>
                                        {isVisited && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${mode === 'bfs' ? 'bg-blue-600' : 'bg-purple-600'
                                                    }`}
                                            >
                                                {orderNum + 1}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Question Header */}
                                    <div className="flex items-start gap-4 p-5 pr-16">
                                        {/* Icon */}
                                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isCurrent ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                            <HelpCircle className={`w-5 h-5 ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                                                    {item.category}
                                                </span>
                                                <span className="font-mono text-xs text-gray-400">
                                                    node[{idx}]
                                                </span>
                                            </div>

                                            <h3 className="font-semibold text-gray-900 text-lg leading-snug">
                                                {item.question}
                                            </h3>
                                        </div>

                                        {/* Expand Icon */}
                                        {isVisited && (
                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                className="shrink-0 mt-1"
                                            >
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Answer */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 pt-0">
                                                    <div className="pl-14 pr-4">
                                                        <p className="text-gray-600 leading-relaxed">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Algorithm Info Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 bg-white rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {mode === 'bfs' ? (
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Layers className="w-6 h-6 text-blue-600" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <GitBranch className="w-6 h-6 text-purple-600" />
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-gray-900">
                                    {mode === 'bfs' ? 'Breadth-First Search' : 'Depth-First Search'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {mode === 'bfs'
                                        ? 'Visits nodes level by level using a Queue (FIFO)'
                                        : 'Explores deep paths first using a Stack (LIFO)'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="font-mono text-sm bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                            Visited: <span className={mode === 'bfs' ? 'text-blue-600' : 'text-purple-600'}>{visitedNodes.length}</span> / {faqItems.length} nodes
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
