"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// Premium Animated Organizational Graph with Beautiful Edges

interface TeamMember {
  id: string
  name: string
  role: string
  tier: "leadership" | "core" | "subcore" | "advisory"
}

// Animated Node Component
function AnimatedNode({
  member,
  delay,
  avatarBg,
  size = "md",
  shouldAnimate
}: {
  member: TeamMember
  delay: number
  avatarBg: string
  size?: "lg" | "md" | "sm"
  shouldAnimate: boolean
}) {
  const sizeClasses = {
    lg: "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32",
    md: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
    sm: "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18"
  }

  const ringColors = {
    leadership: "ring-4 ring-amber-400",
    core: "ring-[3px] ring-blue-500",
    subcore: "ring-2 ring-orange-400",
    advisory: "ring-2 ring-gray-400"
  }

  const glowColors = {
    leadership: "0 0 30px rgba(251, 191, 36, 0.5)",
    core: "0 0 20px rgba(59, 130, 246, 0.4)",
    subcore: "0 0 15px rgba(251, 146, 60, 0.3)",
    advisory: "0 0 15px rgba(156, 163, 175, 0.3)"
  }

  const avatar = (name: string, bg: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=ffffff&rounded=true&size=256`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={shouldAnimate ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay }}
      whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <motion.div
        initial={{ boxShadow: "0 0 0px rgba(0,0,0,0)" }}
        animate={shouldAnimate ? { boxShadow: glowColors[member.tier] } : {}}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
        className={`${sizeClasses[size]} rounded-full overflow-hidden ${ringColors[member.tier]} bg-white`}
      >
        <motion.img
          src={avatar(member.name, avatarBg)}
          alt={member.name}
          className="w-full h-full object-cover"
          initial={{ filter: "blur(10px)" }}
          animate={shouldAnimate ? { filter: "blur(0px)" } : {}}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
        />
      </motion.div>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
      >
        <div className="font-bold text-black text-sm sm:text-base group-hover:text-blue-600 transition-colors">
          {member.name}
        </div>
        <div className="text-xs text-gray-500 font-medium">{member.role}</div>
      </motion.div>
    </motion.div>
  )
}

// Premium Animated Edge with Glow and Flow Effect
function PremiumEdge({
  from,
  to,
  delay,
  gradientId,
  glowColor,
  strokeWidth = 2,
  shouldAnimate
}: {
  from: { x: number; y: number } | null
  to: { x: number; y: number } | null
  delay: number
  gradientId: string
  glowColor: string
  strokeWidth?: number
  shouldAnimate: boolean
}) {
  if (!from || !to) return null

  // Calculate smooth S-curve path
  const dx = to.x - from.x
  const dy = to.y - from.y
  const isVertical = Math.abs(dy) > Math.abs(dx)

  let path: string

  if (isVertical) {
    // Vertical connection - smooth S-curve
    const midY = from.y + dy * 0.5
    const curveStrength = Math.min(Math.abs(dx) * 0.5, 50)
    path = `M ${from.x} ${from.y} 
            C ${from.x} ${from.y + dy * 0.3}, 
              ${from.x + (dx > 0 ? curveStrength : -curveStrength)} ${midY},
              ${from.x + dx * 0.5} ${midY}
            S ${to.x} ${to.y - dy * 0.3},
              ${to.x} ${to.y}`
  } else {
    // Horizontal connection - gentle arc
    const midX = from.x + dx * 0.5
    const arcHeight = Math.min(Math.abs(dy) * 0.3, 30)
    path = `M ${from.x} ${from.y} 
            Q ${midX} ${from.y + (dy > 0 ? arcHeight : -arcHeight)}, 
              ${to.x} ${to.y}`
  }

  const uniqueId = `edge-${from.x}-${from.y}-${to.x}-${to.y}`.replace(/\./g, '-')

  return (
    <g>
      {/* Glow layer */}
      <motion.path
        d={path}
        stroke={glowColor}
        strokeWidth={strokeWidth * 4}
        fill="none"
        strokeLinecap="round"
        opacity={0.3}
        filter="blur(8px)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={shouldAnimate ? { pathLength: 1, opacity: 0.3 } : { pathLength: 0, opacity: 0 }}
        transition={{ pathLength: { duration: 1.5, delay, ease: "easeInOut" }, opacity: { duration: 0.5, delay } }}
      />

      {/* Main edge line */}
      <motion.path
        d={path}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ pathLength: { duration: 1.5, delay, ease: "easeInOut" }, opacity: { duration: 0.3, delay } }}
      />

      {/* Animated flowing dot */}
      <motion.circle
        r={3}
        fill={glowColor}
        filter={`drop-shadow(0 0 4px ${glowColor})`}
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 2, delay: delay + 1.5, repeat: Infinity, repeatDelay: 3 }}
      >
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          begin={`${delay + 1.5}s`}
          path={path}
        />
      </motion.circle>
    </g>
  )
}

export function TeamTree() {
  const coreTable = `
1	TE/TT	23-COMPSA35-27	COMP	A	35	Aayush Dubey	Chairperson
2	TE/TT	23-AI&DSB62-27	AI&DS	B	62	Swamini Yesade	Vice Chairperson
3	TE/TT	23-E&CS48-27	E&CS	N/A	48	Chetan Sharma	Technical Lead
4	TE/TT	23-COMPSA36-27	COMP	A	36	Ayush Dubey	Documentation Lead
5	TE/TT	23-COMPSA21-27	COMP	A	21	Pranjal Chavan	Creative Lead
6	TE/TT	23-AI&MLA42-27	AI&ML	A	42	Rudra Sharma	Research Lead
7	TE/TT	23-AI&DSB12-27	AI&DS	B	12	Kanchan Saini	PR & Marketing Lead
`

  const subCoreTable = `
1	TE/TT	23-CS&E62-27	CS&E	N/A	62	Kshitij Yadav	Problem Setters Head
2	TE/TT	23-ITC30-27	IT	C	30	Shreyansh Singh	Editorialists Head
3	SE/ST	24-COMPSA32-28	COMP	A	32	Purva Gade	Documentation Head
4	TE/TT	23-E&CS30-27	E&CS	N/A	30	Shivam Pandey	Research Head
5	TE/TT	23-COMPSA37-27	COMP	A	37	Pragnesh Dubey	Creative Head
`

  const advisoryTable = `
1	BE/BT	22-ITA28-26	IT	A	28	Amitabh Dwivedi	TSDW Representative
2	BE/BT	22-E&CS10-26	E&CS	NA	10	Rohan Dol	Advisory
3	BE/BT	23-AI&ML67-26	AI&ML	NA	67	Adnan Qureshi	Advisory
`

  const parseTable = (txt: string, prefix: string, tier: TeamMember["tier"]): TeamMember[] => {
    return txt.trim().split('\n').map((line, idx) => {
      const parts = line.split('\t').map((s) => s.trim())
      return { id: `${prefix}${idx + 1}`, name: parts[6] || `Member ${idx + 1}`, role: parts[7] || '', tier }
    })
  }

  const leadership = parseTable(coreTable, 'l', 'leadership').slice(0, 2)
  const core = parseTable(coreTable, 'c', 'core').slice(2)
  const subCore = parseTable(subCoreTable, 's', 'subcore')
  const advisory = parseTable(advisoryTable, 'a', 'advisory')

  const containerRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const calculate = () => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const pos: Record<string, { x: number; y: number }> = {}
        ;[...leadership, ...core, ...subCore, ...advisory].forEach((n) => {
          const el = nodeRefs.current[n.id]
          if (el) {
            const r = el.getBoundingClientRect()
            pos[n.id] = { x: r.left + r.width / 2 - rect.left, y: r.top + r.height / 2 - rect.top }
          }
        })
      setPositions(pos)
    }

    const timeouts = [500, 1500, 3000, 5000].map(t => setTimeout(calculate, t))
    window.addEventListener('resize', calculate)
    return () => {
      timeouts.forEach(clearTimeout)
      window.removeEventListener('resize', calculate)
    }
  }, [isVisible])

  const PHASE = {
    LEADERSHIP: 0.2,
    LEADERSHIP_EDGES: 0.9,
    CORE: 1.3,
    CORE_EDGES: 2.2,
    SUBCORE: 3.0,
    SUBCORE_EDGES: 3.8,
    ADVISORY: 4.4,
    ADVISORY_EDGES: 5.0,
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Organising Committee</h2>
          <p className="text-gray-600">The brilliant minds behind SCPC 2026</p>
        </motion.div>

        <div
          ref={containerRef}
          className="relative bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-lg overflow-visible"
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-2xl overflow-hidden">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Advisory Row */}
          <div className="relative z-10 mb-10">
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: PHASE.ADVISORY }}
            >
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Advisory Board
              </span>
            </motion.div>
            <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16">
              {advisory.map((m, idx) => (
                <div key={m.id} ref={(el) => { nodeRefs.current[m.id] = el }}>
                  <AnimatedNode member={m} delay={PHASE.ADVISORY + idx * 0.15} avatarBg="6b7280" size="sm" shouldAnimate={isVisible} />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-10"
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ delay: PHASE.ADVISORY + 0.4, duration: 1 }}
          />

          {/* Leadership Row */}
          <div className="relative z-10 mb-10">
            <motion.div
              className="text-center mb-5"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: PHASE.LEADERSHIP - 0.1 }}
            >
              <span className="inline-block px-3 py-1 bg-amber-100 rounded-full text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Leadership
              </span>
            </motion.div>
            <div className="flex items-center justify-center gap-16 sm:gap-20 md:gap-28">
              {leadership.map((m, idx) => (
                <div key={m.id} ref={(el) => { nodeRefs.current[m.id] = el }}>
                  <AnimatedNode member={m} delay={PHASE.LEADERSHIP + idx * 0.3} avatarBg="f59e0b" size="lg" shouldAnimate={isVisible} />
                </div>
              ))}
            </div>
          </div>

          {/* Core Team Row */}
          <div className="relative z-10 mb-10">
            <motion.div
              className="text-center mb-5"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: PHASE.CORE - 0.1 }}
            >
              <span className="inline-block px-3 py-1 bg-blue-100 rounded-full text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Core Team
              </span>
            </motion.div>
            <div className="flex items-center justify-center flex-wrap gap-6 sm:gap-8 md:gap-10">
              {core.map((m, idx) => (
                <div key={m.id} ref={(el) => { nodeRefs.current[m.id] = el }}>
                  <AnimatedNode member={m} delay={PHASE.CORE + idx * 0.1} avatarBg="3b82f6" size="md" shouldAnimate={isVisible} />
                </div>
              ))}
            </div>
          </div>

          {/* SubCore Team Row */}
          <div className="relative z-10">
            <motion.div
              className="text-center mb-5"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: PHASE.SUBCORE - 0.1 }}
            >
              <span className="inline-block px-3 py-1 bg-orange-100 rounded-full text-xs font-semibold text-orange-600 uppercase tracking-wider">
                Sub-Core Team
              </span>
            </motion.div>
            <div className="flex items-center justify-center flex-wrap gap-6 sm:gap-8 md:gap-10">
              {subCore.map((m, idx) => (
                <div key={m.id} ref={(el) => { nodeRefs.current[m.id] = el }}>
                  <AnimatedNode member={m} delay={PHASE.SUBCORE + idx * 0.1} avatarBg="f97316" size="md" shouldAnimate={isVisible} />
                </div>
              ))}
            </div>
          </div>

          {/* Premium SVG Edges */}
          {Object.keys(positions).length > 0 && (
            <svg className="absolute inset-0 pointer-events-none z-[1]" width="100%" height="100%" style={{ overflow: 'visible' }}>
              <defs>
                {/* Premium gradients */}
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
                <linearGradient id="grayGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#d1d5db" />
                  <stop offset="50%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#d1d5db" />
                </linearGradient>

                {/* Glow filters */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Leadership connection */}
              {leadership.length >= 2 && (
                <PremiumEdge
                  from={positions[leadership[0].id]}
                  to={positions[leadership[1].id]}
                  delay={PHASE.LEADERSHIP_EDGES}
                  gradientId="goldGradient"
                  glowColor="#fbbf24"
                  strokeWidth={3}
                  shouldAnimate={isVisible}
                />
              )}

              {/* Leadership to Core */}
              {core.map((c, idx) => (
                <PremiumEdge
                  key={`lc-${c.id}`}
                  from={positions[leadership[0]?.id]}
                  to={positions[c.id]}
                  delay={PHASE.CORE_EDGES + idx * 0.08}
                  gradientId="blueGradient"
                  glowColor="#3b82f6"
                  strokeWidth={2}
                  shouldAnimate={isVisible}
                />
              ))}

              {/* VCP to some core */}
              {core.slice(0, 2).map((c, idx) => (
                <PremiumEdge
                  key={`vc-${c.id}`}
                  from={positions[leadership[1]?.id]}
                  to={positions[c.id]}
                  delay={PHASE.CORE_EDGES + 0.3 + idx * 0.08}
                  gradientId="blueGradient"
                  glowColor="#3b82f6"
                  strokeWidth={1.5}
                  shouldAnimate={isVisible}
                />
              ))}

              {/* Core to SubCore */}
              {subCore.map((s, idx) => (
                <PremiumEdge
                  key={`cs-${s.id}`}
                  from={positions[core[idx % core.length]?.id]}
                  to={positions[s.id]}
                  delay={PHASE.SUBCORE_EDGES + idx * 0.1}
                  gradientId="orangeGradient"
                  glowColor="#f97316"
                  strokeWidth={1.5}
                  shouldAnimate={isVisible}
                />
              ))}

              {/* Advisory to Leadership */}
              {advisory.map((a, idx) => (
                <PremiumEdge
                  key={`al-${a.id}`}
                  from={positions[a.id]}
                  to={positions[leadership[idx % leadership.length]?.id]}
                  delay={PHASE.ADVISORY_EDGES + idx * 0.12}
                  gradientId="grayGradient"
                  glowColor="#9ca3af"
                  strokeWidth={1.5}
                  shouldAnimate={isVisible}
                />
              ))}
            </svg>
          )}
        </div>
      </div>
    </section>
  )
}
