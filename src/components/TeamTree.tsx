"use client"

import { m } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState, useCallback } from "react"
import { MEMBER_IMAGE_URLS, BEHIND_EVENT_IMAGE } from "@/lib/constants"

interface TeamMember {
  id: string
  name: string
  role: string
  tier: "leadership" | "core" | "subcore" | "advisory"
  index: number
}

// Move static data definitions outside or use useMemo
const parse = (txt: string, tier: TeamMember["tier"], start: number): TeamMember[] =>
  txt.trim().split('\n').map((line, i) => {
    const p = line.split('\t')
    return { id: `${tier}-${i}`, name: p[6] || '', role: p[7] || '', tier, index: start + i }
  })

const ADVISORY_DATA = parse(`
1	BE/BT	22-ITA28-26	IT	A	28	Amitabh Dwivedi	TSDW Representative
2	BE/BT	22-E&CS10-26	E&CS	NA	10	Rohan Dol	Advisory
3	BE/BT	23-AI&ML67-26	AI&ML	NA	67	Adnan Qureshi	Advisory`, 'advisory', 0)

const LEADERSHIP_DATA = parse(`
1	TE/TT	23-COMPSA35-27	COMP	A	35	Aayush Dubey	Chairperson
2	TE/TT	23-AI&DSB62-27	AI&DS	B	62	Swamini Yesade	Vice Chairperson`, 'leadership', ADVISORY_DATA.length)

const CORE_DATA = parse(`
3	TE/TT	23-E&CS48-27	E&CS	N/A	48	Chetan Sharma	Technical Lead
4	TE/TT	23-COMPSA36-27	COMP	A	36	Ayush Dubey	Documentation Lead
5	TE/TT	23-COMPSA21-27	COMP	A	21	Pranjal Chavan	Creative Lead
6	TE/TT	23-AI&MLA42-27	AI&ML	A	42	Rudra Sharma	Research Lead
7	TE/TT	23-AI&DSB12-27	AI&DS	B	12	Kanchan Saini	PR & Marketing Lead`, 'core', ADVISORY_DATA.length + LEADERSHIP_DATA.length)

const SUBCORE_DATA = parse(`
1	TE/TT	23-CS&E62-27	CS&E	N/A	62	Kshitij Yadav	Problem Setters Head
2	TE/TT	23-ITC30-27	IT	C	30	Shreyansh Singh	Editorialists Head
3	TE/TT	23-CS&E62-27	CS&E	N/A	62	Kashish	Creative Head
3	SE/ST	24-COMPSA32-28	COMP	A	32	Purva Gade	Documentation Head
4	TE/TT	23-E&CS30-27	E&CS	N/A	30	Shivam Pandey	Research Head
5	TE/TT	23-COMPSA37-27	COMP	A	37	Pragnesh Dubey	PR Head`, 'subcore', ADVISORY_DATA.length + LEADERSHIP_DATA.length + CORE_DATA.length)

function TreeNode({
  member, delay, size, isVisible, onNodeRef
}: {
  member: TeamMember
  delay: number
  size: "lg" | "md" | "sm"
  isVisible: boolean
  onNodeRef?: (el: HTMLDivElement | null) => void
}) {
  const sizes = {
    lg: { avatar: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24", text: "w-24 sm:w-28 md:w-32" },
    md: { avatar: "w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18", text: "w-20 sm:w-24 md:w-28" },
    sm: { avatar: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14", text: "w-16 sm:w-20 md:w-24" }
  }
  const rings = {
    leadership: "ring-amber-400",
    core: "ring-blue-500",
    subcore: "ring-green-500",
    advisory: "ring-purple-500"
  }
  const badges = {
    leadership: "bg-amber-500",
    core: "bg-blue-500",
    subcore: "bg-green-500",
    advisory: "bg-purple-500"
  }

  const getImg = (name: string) => MEMBER_IMAGE_URLS[name]

  const cfg = sizes[size]

  return (
    <m.div
      ref={onNodeRef}
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
      className="flex flex-col items-center relative z-10"
    >
      {/* Avatar container */}
      <div className="relative mb-2">
        <m.div
          initial={{ boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
          animate={isVisible ? { boxShadow: "0 4px 15px rgba(0,0,0,0.1)" } : {}}
          transition={{ delay: delay + 0.2 }}
          className={`${cfg.avatar} ring-[3px] ${rings[member.tier]} rounded-full overflow-hidden bg-gray-100 relative`}
        >
          <Image
            src={getImg(member.name)}
            alt={member.name}
            fill
            unoptimized
            className="object-cover"
          />
        </m.div>
        <m.span
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ type: "spring", delay: delay + 0.15 }}
          className={`absolute -top-1 -right-1 w-5 h-5 ${badges[member.tier]} text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md`}
        >
          {member.index}
        </m.span>
      </div>
      {/* Text - wider container for proper centering */}
      <div className={`text-center ${cfg.text}`}>
        <div className="font-semibold text-gray-800 dark:text-gray-200 text-[10px] sm:text-[11px] md:text-xs leading-tight">{member.name}</div>
        <div className="text-gray-500 dark:text-gray-400 text-[8px] sm:text-[9px] md:text-[10px] leading-tight ">{member.role}</div>
      </div>
    </m.div>
  )
}

// Edge with proper path - static version to prevent layout issues
function AnimatedEdge({
  x1, y1, x2, y2, color
}: {
  x1: number; y1: number; x2: number; y2: number
  color: string
}) {
  const midY = y1 + (y2 - y1) * 0.5
  const path = `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`

  return (
    <g>
      <path
        d={path}
        stroke={color}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.08}
      />
      <path
        d={path}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
    </g>
  )
}

function GlassLabel({ text, colorClass, delay, isVisible }: { text: string; colorClass: string; delay: number; isVisible: boolean }) {
  return (
    <m.div
      initial={{ opacity: 0, y: -10, scale: 0.85 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative z-30 inline-block px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-wider
        bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-600 shadow-md dark:shadow-lg
        ${colorClass}`}
    >
      <span className="relative z-10">{text}</span>
    </m.div>
  )
}

function ProgressiveTeamImage() {
  const [currentSrc, setCurrentSrc] = useState(BEHIND_EVENT_IMAGE)

  useEffect(() => {
    const highResUrl = BEHIND_EVENT_IMAGE.replace('w_1600,f_auto,q_90', 'f_auto,q_auto')
    
    // Safety check - if replacement failed (structure changed), don't do anything
    if (highResUrl === BEHIND_EVENT_IMAGE) return

    const img = new window.Image()
    img.src = highResUrl
    img.onload = () => {
      setCurrentSrc(highResUrl)
    }
  }, [])

  return (
    <img
      src={currentSrc}
      alt="Behind this event"
      className="w-full h-auto block transition-opacity duration-700"
      loading="lazy"
    />
  )
}

export function TeamTree() {
  const advisory = ADVISORY_DATA
  const leadership = LEADERSHIP_DATA
  const core = CORE_DATA
  const subCore = SUBCORE_DATA

  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [positions, setPositions] = useState<Record<string, { x: number; y: number; bottom: number }>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setIsVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const calcPos = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const cRect = c.getBoundingClientRect()

    const pos: typeof positions = {}
    const allMembers = [...advisory, ...leadership, ...core, ...subCore]
    allMembers.forEach(m => {
      const el = nodeRefs.current[m.id]
      if (el) {
        const r = el.getBoundingClientRect()
        pos[m.id] = {
          x: r.left + r.width / 2 - cRect.left,
          y: r.top - cRect.top,
          bottom: r.bottom - cRect.top
        }
      }
    })
    // Only update if positions actually changed to prevent infinite loops
    setPositions(prev => {
      const prevKeys = Object.keys(prev)
      const posKeys = Object.keys(pos)
      if (prevKeys.length !== posKeys.length) return pos
      for (const key of posKeys) {
        if (!prev[key] || 
            Math.abs(prev[key].x - pos[key].x) > 1 || 
            Math.abs(prev[key].y - pos[key].y) > 1) {
          return pos
        }
      }
      return prev
    })
  }, [advisory, leadership, core, subCore])

  useEffect(() => {
    if (!isVisible) return
    // Initial calculation after animations settle
    const t = setTimeout(calcPos, 800)
    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(calcPos, 150)
    }
    window.addEventListener('resize', handleResize)
    return () => { 
      clearTimeout(t)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize) 
    }
  }, [isVisible, calcPos])

  const D = { ADV: 0, LEAD: 0.3, CORE: 0.65, SUB: 1.0 }
  const hasPos = Object.keys(positions).length >= advisory.length + leadership.length + core.length + subCore.length

  // Get center X and bottom Y for a tier (for edge starting points)
  const getTierCenter = (members: TeamMember[]) => {
    const ps = members.map(m => positions[m.id]).filter(Boolean)
    if (ps.length === 0) return null
    return {
      x: ps.reduce((s, p) => s + p.x, 0) / ps.length,
      bottom: Math.max(...ps.map(p => p.bottom))
    }
  }

  return (
    <section className="py-16 bg-white dark:bg-[#0f0f0f] transition-colors duration-300" style={{ overflow: 'hidden', overflowX: 'clip', overflowY: 'clip' }}>
      <div className="max-w-5xl mx-auto px-4" style={{ overflow: 'hidden' }}>
        <m.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Organising Committee</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">The team behind SCPC 2026</p>
        </m.div>

        <div ref={containerRef} className="relative bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-6 sm:p-10 shadow-sm" style={{ overflow: 'hidden' }}>

          {/* SVG Edges */}
          {hasPos && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, overflow: 'hidden' }}>
              {/* Advisory → Leadership */}
              {(() => {
                const adv = getTierCenter(advisory)
                const lead = getTierCenter(leadership)
                if (!adv || !lead) return null

                return leadership.map((l, i) => {
                  const lp = positions[l.id]
                  if (!lp) return null
                  return (
                    <AnimatedEdge
                      key={`a-l-${i}`}
                      x1={adv.x}
                      y1={adv.bottom + 8}
                      x2={lp.x}
                      y2={lp.y - 5}
                      color="#a78bfa"
                    />
                  )
                })
              })()}

              {/* Leadership → Core - from CENTER between both leaders */}
              {(() => {
                const lead = getTierCenter(leadership)
                if (!lead) return null

                return core.map((c, i) => {
                  const cp = positions[c.id]
                  if (!cp) return null
                  return (
                    <AnimatedEdge
                      key={`l-c-${i}`}
                      x1={lead.x}
                      y1={lead.bottom + 8}
                      x2={cp.x}
                      y2={cp.y - 5}
                      color="#fbbf24"
                    />
                  )
                })
              })()}

              {/* Core → SubCore */}
              {(() => {
                const coreCenter = getTierCenter(core)
                if (!coreCenter) return null

                return subCore.map((s, i) => {
                  const sp = positions[s.id]
                  if (!sp) return null
                  return (
                    <AnimatedEdge
                      key={`c-s-${i}`}
                      x1={coreCenter.x}
                      y1={coreCenter.bottom + 8}
                      x2={sp.x}
                      y2={sp.y - 5}
                      color="#3b82f6"
                    />
                  )
                })
              })()}
            </svg>
          )}

          {/* Level 0: Advisory */}
          <div className="relative z-10 mb-12 sm:mb-14">
            <div className="text-center mb-6">
              <GlassLabel text="Advisory" colorClass="text-purple-600" delay={D.ADV} isVisible={isVisible} />
            </div>
            <div className="flex justify-center gap-5 sm:gap-8 md:gap-12">
              {advisory.map((m, i) => (
                <TreeNode
                  key={m.id}
                  member={m}
                  delay={D.ADV + 0.08 + i * 0.1}
                  size="sm"
                  isVisible={isVisible}
                  onNodeRef={el => { nodeRefs.current[m.id] = el }}
                />
              ))}
            </div>
          </div>

          {/* Level 1: Leadership */}
          <div className="relative z-10 mb-12 sm:mb-14">
            <div className="text-center mb-6">
              <GlassLabel text="Leadership" colorClass="text-amber-600" delay={D.LEAD} isVisible={isVisible} />
            </div>
            <div className="flex justify-center gap-10 sm:gap-16 md:gap-24">
              {leadership.map((m, i) => (
                <TreeNode
                  key={m.id}
                  member={m}
                  delay={D.LEAD + 0.08 + i * 0.12}
                  size="lg"
                  isVisible={isVisible}
                  onNodeRef={el => { nodeRefs.current[m.id] = el }}
                />
              ))}
            </div>
          </div>

          {/* Level 2: Core */}
          <div className="relative z-10 mb-12 sm:mb-14">
            <div className="text-center mb-6">
              <GlassLabel text="Core" colorClass="text-blue-600" delay={D.CORE} isVisible={isVisible} />
            </div>
            <div className="flex justify-center flex-wrap gap-3 sm:gap-5 md:gap-8">
              {core.map((m, i) => (
                <TreeNode
                  key={m.id}
                  member={m}
                  delay={D.CORE + 0.08 + i * 0.07}
                  size="md"
                  isVisible={isVisible}
                  onNodeRef={el => { nodeRefs.current[m.id] = el }}
                />
              ))}
            </div>
          </div>

          {/* Level 3: SubCore */}
          <div className="relative z-10">
            <div className="text-center mb-6">
              <GlassLabel text="SubCore" colorClass="text-green-600" delay={D.SUB} isVisible={isVisible} />
            </div>
            <div className="flex justify-center flex-wrap gap-3 sm:gap-5 md:gap-8">
              {subCore.map((m, i) => (
                <TreeNode
                  key={m.id}
                  member={m}
                  delay={D.SUB + 0.08 + i * 0.07}
                  size="md"
                  isVisible={isVisible}
                  onNodeRef={el => { nodeRefs.current[m.id] = el }}
                />
              ))}
            </div>
          </div>

          {/* Behind This Event Card */}
          <div className="relative z-10 mt-16 sm:mt-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Behind this event...</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">The faces that make it happen</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 border-2 border-indigo-300/60 dark:border-indigo-600/50 shadow-xl p-3 sm:p-4">
                {/* Card content */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden">
                  {/* Image - Progressive Load */}
                  <ProgressiveTeamImage />

                  {/* Team name text */}
                  <div className="py-5 sm:py-6 md:py-8 px-4 text-center bg-gradient-to-r from-blue-50 via-white to-orange-50 dark:from-blue-900/20 dark:via-[#1a1a1a] dark:to-orange-900/20">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent leading-tight px-2"
                      style={{ fontFamily: 'var(--font-dancing-script), cursive' }}>
                      Team TCET-Shastra 2025-26<span className="text-orange-500">!!</span>
                    </h2>
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