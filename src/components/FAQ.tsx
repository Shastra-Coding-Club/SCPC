"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"
import { Play, RotateCcw, GitBranch, Layers, ChevronDown, HelpCircle, MessageCircle } from "lucide-react"

const faqItems = [
    { id: "q1", category: "General", question: "What is TCET SHASTRA?", answer: "TCET SHASTRA is a 12-hour competitive programming hackathon organized by Thakur College of Engineering & Technology. It brings together coders from various colleges to solve algorithmic challenges." },
    { id: "q2", category: "General", question: "When and where is the event?", answer: "The event is scheduled for January 15, 2026 at TCET Campus, Kandivali (E), Mumbai. It starts at 9:00 AM and runs for 12 hours." },
    { id: "q3", category: "Registration", question: "How do I register?", answer: "You can register through our official registration portal. Click the 'Register Now' button on our website. Registration is open until slots are filled!" },
    { id: "q4", category: "Registration", question: "What's the team size?", answer: "Teams can have 2-4 members. All team members must register together. Solo participation is not allowed." },
    { id: "q5", category: "Prizes", question: "What are the prizes?", answer: "Total prize pool is ₹90,000+! 1st Prize: ₹45,000, 2nd Prize: ₹30,000, 3rd Prize: ₹15,000. Plus special category awards and goodies for all participants." },
    { id: "q6", category: "Technical", question: "What languages are allowed?", answer: "You can use C, C++, Java, Python, or JavaScript. The platform supports all major competitive programming languages." },
]

type NodeType = { faqIdx: number; type: 'question' | 'answer' }

function bfsOrder(): NodeType[] {
    const order: NodeType[] = []
    faqItems.forEach((_, idx) => order.push({ faqIdx: idx, type: 'question' }))
    faqItems.forEach((_, idx) => order.push({ faqIdx: idx, type: 'answer' }))
    return order
}

function dfsOrder(): NodeType[] {
    const order: NodeType[] = []
    faqItems.forEach((_, idx) => {
        order.push({ faqIdx: idx, type: 'question' })
        order.push({ faqIdx: idx, type: 'answer' })
    })
    return order
}

export function FAQ() {
    const [mode, setMode] = useState<'bfs' | 'dfs'>('bfs')
    const [visitedNodes, setVisitedNodes] = useState<NodeType[]>([])
    const [currentNode, setCurrentNode] = useState<NodeType | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [animationComplete, setAnimationComplete] = useState(false)
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
    const sectionRef = useRef<HTMLElement>(null)
    const hasStartedRef = useRef(false)

    const traversalOrder = mode === 'bfs' ? bfsOrder() : dfsOrder()

    const isQuestionVisited = (idx: number) => visitedNodes.some(n => n.faqIdx === idx && n.type === 'question')
    const isAnswerVisited = (idx: number) => visitedNodes.some(n => n.faqIdx === idx && n.type === 'answer')
    const isQuestionCurrent = (idx: number) => currentNode?.faqIdx === idx && currentNode?.type === 'question'
    const isAnswerCurrent = (idx: number) => currentNode?.faqIdx === idx && currentNode?.type === 'answer'

    const getQuestionOrder = (idx: number) => {
        const nodeIndex = visitedNodes.findIndex(n => n.faqIdx === idx && n.type === 'question')
        return nodeIndex >= 0 ? nodeIndex + 1 : null
    }
    const getAnswerOrder = (idx: number) => {
        const nodeIndex = visitedNodes.findIndex(n => n.faqIdx === idx && n.type === 'answer')
        return nodeIndex >= 0 ? nodeIndex + 1 : null
    }

    const startAnimation = useCallback(() => {
        setVisitedNodes([])
        setCurrentNode(null)
        setAnimationComplete(false)
        setExpandedIdx(null)
        setIsAnimating(true)
        hasStartedRef.current = true
    }, [])

    const resetAnimation = useCallback(() => {
        setVisitedNodes([])
        setCurrentNode(null)
        setAnimationComplete(false)
        setExpandedIdx(null)
        setIsAnimating(false)
        hasStartedRef.current = false
    }, [])

    const switchMode = useCallback((newMode: 'bfs' | 'dfs') => {
        setMode(newMode)
        setVisitedNodes([])
        setCurrentNode(null)
        setAnimationComplete(false)
        setExpandedIdx(null)
        setTimeout(() => {
            setIsAnimating(true)
            hasStartedRef.current = true
        }, 100)
    }, [])

    useEffect(() => {
        if (!isAnimating) return

        let running = true
        const timers: number[] = []

        traversalOrder.forEach((node, i) => {
            const t = window.setTimeout(() => {
                if (!running) return
                setCurrentNode(node)
                setVisitedNodes(prev => [...prev, node])
            }, i * 400)
            timers.push(t)
        })

        const completeTimer = window.setTimeout(() => {
            if (running) {
                setIsAnimating(false)
                setCurrentNode(null)
                // Collapse after a short delay so user can see full animation result
                setTimeout(() => {
                    setAnimationComplete(true)
                }, 1500)
            }
        }, traversalOrder.length * 400 + 400)
        timers.push(completeTimer)

        return () => {
            running = false
            timers.forEach(t => clearTimeout(t))
        }
    }, [isAnimating, traversalOrder])

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
                    className="text-center mb-12"
                >
                    <div className="inline-block mb-4">
                        <span className="font-mono text-sm text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                            // faqTree.traverse({'{'}mode{'}'})
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Frequently Asked{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Questions
                        </span>
                    </h2>

                    <p className="text-gray-500 text-lg mb-2">
                        Question → Answer: Parent → Child relationship
                    </p>
                    <p className="text-gray-400 text-sm mb-8">
                        {mode === 'bfs' 
                            ? "BFS: Visit all questions first (level 0), then all answers (level 1)"
                            : "DFS: Go deep into each FAQ before moving to the next"
                        }
                    </p>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="inline-flex items-center p-1.5 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                            <button
                                onClick={() => switchMode('bfs')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === 'bfs'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Layers className="w-4 h-4" />
                                BFS (Level by Level)
                            </button>
                            <button
                                onClick={() => switchMode('dfs')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === 'dfs'
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <GitBranch className="w-4 h-4" />
                                DFS (Go Deep)
                            </button>
                        </div>

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
                                aria-label="Reset animation"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ Cards */}
                <div className="space-y-4">
                    {faqItems.map((item, idx) => {
                        const qVisited = isQuestionVisited(idx)
                        const aVisited = isAnswerVisited(idx)
                        const qCurrent = isQuestionCurrent(idx)
                        const aCurrent = isAnswerCurrent(idx)
                        const qOrder = getQuestionOrder(idx)
                        const aOrder = getAnswerOrder(idx)
                        
                        const showAnswer = animationComplete 
                            ? (expandedIdx === idx)
                            : aVisited

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="relative"
                            >
                            <div 
                                className={`bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 ${animationComplete ? 'cursor-pointer hover:shadow-md' : ''} ${
                                    qCurrent || aCurrent
                                        ? 'border-blue-500 shadow-lg shadow-blue-100'
                                        : qVisited
                                        ? 'border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                        : 'border-gray-200 opacity-50'
                                }`}
                                onClick={() => animationComplete && setExpandedIdx(expandedIdx === idx ? null : idx)}
                            >
                                    
                                    {/* Question Row (Parent Node) */}
                                    <div className={`flex items-start gap-4 p-5 transition-all ${
                                        qCurrent ? 'bg-blue-50' : ''
                                    }`}>
                                        {/* Question Icon + Order */}
                                        <div className="relative shrink-0">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                qCurrent 
                                                    ? 'bg-blue-500 text-white' 
                                                    : qVisited 
                                                    ? 'bg-gray-900 text-white' 
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                <HelpCircle className="w-5 h-5" />
                                            </div>
                                            {qOrder !== null && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                                                        mode === 'bfs' ? 'bg-blue-600' : 'bg-purple-600'
                                                    }`}
                                                >
                                                    {qOrder}
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Question Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                                                    {item.category}
                                                </span>
                                                <span className="font-mono text-[10px] text-gray-400 uppercase">
                                                    Level 0 • Question
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 text-lg leading-snug">
                                                {item.question}
                                            </h3>
                                        </div>

                                        {/* Expand indicator after animation */}
                                        {animationComplete && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="shrink-0"
                                            >
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedIdx === idx ? 'rotate-180' : ''}`} />
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Answer Row (Child Node) */}
                                    <AnimatePresence>
                                        {showAnswer && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className={`flex items-start gap-4 px-5 pb-5 pt-3 border-t border-gray-200 transition-all ${
                                                    aCurrent ? 'bg-purple-50' : 'bg-gray-50'
                                                }`}>
                                                    {/* Answer Icon + Order */}
                                                    <div className="relative shrink-0 ml-5">
                                                        <div className="absolute -left-5 top-0 h-full w-px bg-gray-300" />
                                                        <div className="absolute -left-6 top-4 w-3 h-px bg-gray-300" />
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                            aCurrent 
                                                                ? 'bg-purple-500 text-white' 
                                                                : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                            <MessageCircle className="w-4 h-4" />
                                                        </div>
                                                        {aOrder !== null && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                                                                    mode === 'bfs' ? 'bg-blue-600' : 'bg-purple-600'
                                                                }`}
                                                            >
                                                                {aOrder}
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                    {/* Answer Content */}
                                                    <div className="flex-1">
                                                        <span className="font-mono text-[10px] text-gray-400 uppercase mb-1 block">
                                                            Level 1 • Answer
                                                        </span>
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
                                        ? 'Q1→Q2→Q3→Q4→Q5→Q6 (all questions) → A1→A2→A3→A4→A5→A6 (all answers)'
                                        : 'Q1→A1 → Q2→A2 → Q3→A3 → Q4→A4 → Q5→A5 → Q6→A6 (go deep each time)'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="font-mono text-sm bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                            Visited: <span className={mode === 'bfs' ? 'text-blue-600' : 'text-purple-600'}>{visitedNodes.length}</span> / {faqItems.length * 2} nodes
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
