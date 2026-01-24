"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"
import { MEMBER_IMAGE_URLS } from "@/lib/constants"

// Binary Tree - Clean Alignment

interface TeamMember {
  id: string
  name: string
  role: string
  tier: "leadership" | "core" | "subcore" | "advisory"
  index: number
}

// Node with separate avatar ref for edge connections
function TreeNode({
  member, delay, size, isVisible, onAvatarRef
}: {
  member: TeamMember
  delay: number
  size: "lg" | "md" | "sm"
  isVisible: boolean
  onAvatarRef?: (el: HTMLDivElement | null) => void
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

  const getImg = (name: string) => {
    const local = MEMBER_IMAGE_URLS[name]
    return local || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f1f5f9&color=334155&rounded=true&size=200`
  }

  const cfg = sizes[size]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
      className="flex flex-col items-center relative z-10"
    >
      {/* Avatar container - this is what edges connect to */}
      <div ref={onAvatarRef} className="relative mb-2">
        <motion.div
          initial={{ boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
          animate={isVisible ? { boxShadow: "0 4px 15px rgba(0,0,0,0.1)" } : {}}
          transition={{ delay: delay + 0.2 }}
          className={`${cfg.avatar} ring-[3px] ${rings[member.tier]} rounded-full overflow-hidden bg-gray-100`}
        >
          <img src={getImg(member.name)} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
        </motion.div>
        <motion.span
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ type: "spring", delay: delay + 0.15 }}
          className={`absolute -top-1 -right-1 w-5 h-5 ${badges[member.tier]} text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md`}
        >
          {member.index}
        </motion.span>
      </div>
      {/* Text - wider container for proper centering */}
      <div className={`text-center ${cfg.text}`}>
        <div className="font-semibold text-gray-800 text-[10px] sm:text-[11px] md:text-xs leading-tight truncate">{member.name}</div>
        <div className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] leading-tight truncate">{member.role}</div>
      </div>
    </motion.div>
  )
}

// Edge with proper path
function AnimatedEdge({
  x1, y1, x2, y2, delay, color, isVisible
}: {
  x1: number; y1: number; x2: number; y2: number
  delay: number; color: string; isVisible: boolean
}) {
  const midY = y1 + (y2 - y1) * 0.5
  const path = `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`

  return (
    <g>
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.08}
        initial={{ pathLength: 0 }}
        animate={isVisible ? { pathLength: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
      />
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
        initial={{ pathLength: 0 }}
        animate={isVisible ? { pathLength: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
      />
      <motion.circle
        r={3}
        fill={color}
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: [0, 0.8, 0.8, 0] } : {}}
        transition={{ duration: 2, delay: delay + 1.2, repeat: Infinity, repeatDelay: 4 }}
      >
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </motion.circle>
    </g>
  )
}

// Glass Label
function GlassLabel({ text, colorClass, delay, isVisible }: { text: string; colorClass: string; delay: number; isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.85 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative z-30 inline-block px-5 py-2 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-wider
        backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-white/40
        border border-white/60 shadow-lg shadow-black/5 ${colorClass}`}
    >
      {text}
    </motion.div>
  )
}

export function TeamTree() {
  const parse = (txt: string, tier: TeamMember["tier"], start: number): TeamMember[] =>
    txt.trim().split('\n').map((line, i) => {
      const p = line.split('\t')
      return { id: `${tier}-${i}`, name: p[6] || '', role: p[7] || '', tier, index: start + i }
    })

  const advisory = parse(`
1	BE/BT	22-ITA28-26	IT	A	28	Amitabh Dwivedi	TSDW Representative
2	BE/BT	22-E&CS10-26	E&CS	NA	10	Rohan Dol	Advisory
3	BE/BT	23-AI&ML67-26	AI&ML	NA	67	Adnan Qureshi	Advisory`, 'advisory', 0)

  const leadership = parse(`
1	TE/TT	23-COMPSA35-27	COMP	A	35	Aayush Dubey	Chairperson
2	TE/TT	23-AI&DSB62-27	AI&DS	B	62	Swamini Yesade	Vice Chairperson`, 'leadership', advisory.length)

  const core = parse(`
3	TE/TT	23-E&CS48-27	E&CS	N/A	48	Chetan Sharma	Technical Lead
4	TE/TT	23-COMPSA36-27	COMP	A	36	Ayush Dubey	Documentation Lead
5	TE/TT	23-COMPSA21-27	COMP	A	21	Pranjal Chavan	Creative Lead
6	TE/TT	23-AI&MLA42-27	AI&ML	A	42	Rudra Sharma	Research Lead
7	TE/TT	23-AI&DSB12-27	AI&DS	B	12	Kanchan Saini	PR & Marketing Lead`, 'core', advisory.length + leadership.length)

  const subCore = parse(`
1	TE/TT	23-CS&E62-27	CS&E	N/A	62	Kshitij Yadav	Problem Setters Head
2	TE/TT	23-ITC30-27	IT	C	30	Shreyansh Singh	Editorialists Head
3	SE/ST	24-COMPSA32-28	COMP	A	32	Purva Gade	Documentation Head
4	TE/TT	23-E&CS30-27	E&CS	N/A	30	Shivam Pandey	Research Head
5	TE/TT	23-COMPSA37-27	COMP	A	37	Pragnesh Dubey	Creative Head`, 'subcore', advisory.length + leadership.length + core.length)

  const containerRef = useRef<HTMLDivElement>(null)
  const avatarRefs = useRef<Record<string, HTMLDivElement | null>>({})
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
    ;[...advisory, ...leadership, ...core, ...subCore].forEach(m => {
      const el = avatarRefs.current[m.id]
      if (el) {
        const r = el.getBoundingClientRect()
        // Track avatar center for edge connections
        pos[m.id] = { 
          x: r.left + r.width / 2 - cRect.left, 
          y: r.top - cRect.top, 
          bottom: r.bottom - cRect.top 
        }
      }
    })
    setPositions(pos)
  }, [advisory, leadership, core, subCore])

  useEffect(() => {
    if (!isVisible) return
    const t = [150, 500, 1000, 1800].map(d => setTimeout(calcPos, d))
    window.addEventListener('resize', calcPos)
    return () => { t.forEach(clearTimeout); window.removeEventListener('resize', calcPos) }
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
    <section className="py-16 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Organising Committee</h2>
          <p className="text-gray-500 text-sm">The team behind SCPC 2026</p>
        </motion.div>

        <div ref={containerRef} className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 sm:p-8 shadow-sm overflow-hidden">
          
          {/* SVG Edges */}
          {hasPos && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {/* Advisory → Leadership */}
              {(() => {
                const adv = getTierCenter(advisory)
                const lead = getTierCenter(leadership)
                if (!adv || !lead) return null
                
                // Draw from advisory center to center between leadership, then split
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
                      delay={D.LEAD + 0.15 + i * 0.06}
                      color="#a78bfa"
                      isVisible={isVisible}
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
                      delay={D.CORE + 0.15 + i * 0.05}
                      color="#fbbf24"
                      isVisible={isVisible}
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
                      delay={D.SUB + 0.15 + i * 0.05}
                      color="#3b82f6"
                      isVisible={isVisible}
                    />
                  )
                })
              })()}
            </svg>
          )}

          {/* Level 0: Advisory */}
          <div className="relative z-10 mb-10 sm:mb-12">
            <div className="text-center mb-4">
              <GlassLabel text="Root — Advisory" colorClass="text-purple-600" delay={D.ADV} isVisible={isVisible} />
            </div>
            <div className="flex justify-center gap-4 sm:gap-6 md:gap-10">
              {advisory.map((m, i) => (
                <TreeNode 
                  key={m.id} 
                  member={m} 
                  delay={D.ADV + 0.08 + i * 0.1} 
                  size="sm" 
                  isVisible={isVisible}
                  onAvatarRef={el => { avatarRefs.current[m.id] = el }}
                />
              ))}
            </div>
          </div>

          {/* Level 1: Leadership */}
          <div className="relative z-10 mb-10 sm:mb-12">
            <div className="text-center mb-4">
              <GlassLabel text="Level 1 — Leadership" colorClass="text-amber-600" delay={D.LEAD} isVisible={isVisible} />
            </div>
            <div className="flex justify-center gap-8 sm:gap-12 md:gap-20">
              {leadership.map((m, i) => (
                <TreeNode 
                  key={m.id} 
                  member={m} 
                  delay={D.LEAD + 0.08 + i * 0.12} 
                  size="lg" 
                  isVisible={isVisible}
                  onAvatarRef={el => { avatarRefs.current[m.id] = el }}
                />
              ))}
            </div>
          </div>

          {/* Level 2: Core */}
          <div className="relative z-10 mb-10 sm:mb-12">
            <div className="text-center mb-4">
              <GlassLabel text="Level 2 — Core" colorClass="text-blue-600" delay={D.CORE} isVisible={isVisible} />
            </div>
            <div className="flex justify-center flex-wrap gap-3 sm:gap-5 md:gap-8">
              {core.map((m, i) => (
                <TreeNode 
                  key={m.id} 
                  member={m} 
                  delay={D.CORE + 0.08 + i * 0.07} 
                  size="md" 
                  isVisible={isVisible}
                  onAvatarRef={el => { avatarRefs.current[m.id] = el }}
                />
              ))}
            </div>
          </div>

          {/* Level 3: SubCore */}
          <div className="relative z-10">
            <div className="text-center mb-4">
              <GlassLabel text="Level 3 — SubCore" colorClass="text-green-600" delay={D.SUB} isVisible={isVisible} />
            </div>
            <div className="flex justify-center flex-wrap gap-3 sm:gap-5 md:gap-8">
              {subCore.map((m, i) => (
                <TreeNode 
                  key={m.id} 
                  member={m} 
                  delay={D.SUB + 0.08 + i * 0.07} 
                  size="md" 
                  isVisible={isVisible}
                  onAvatarRef={el => { avatarRefs.current[m.id] = el }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
