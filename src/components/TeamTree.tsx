"use client"

import { motion } from "framer-motion"
import { useLayoutEffect, useRef, useState } from "react"

// TeamTree: separate component with larger core avatars and slow hierarchical staggered animation
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

  const parseTable = (txt: string, prefix = "") => {
    return txt
      .trim()
      .split('\n')
      .map((line, idx) => {
        const parts = line.split('\t').map((s) => s.trim())
        const name = parts[6] || `Member ${idx + 1}`
        const role = parts[7] || ''
        return { id: `${prefix}${idx + 1}`, name, role }
      })
  }

  const core = parseTable(coreTable, 'c')
  const subCore = parseTable(subCoreTable, 's')
  const advisory = parseTable(advisoryTable, 'a')

  const containerRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})

  useLayoutEffect(() => {
    const calculate = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const pos: Record<string, { x: number; y: number }> = {}
      const all = [...core, ...subCore, ...advisory]
      all.forEach((n) => {
        const el = nodeRefs.current[n.id]
        if (el) {
          const r = el.getBoundingClientRect()
          pos[n.id] = { x: r.left + r.width / 2 - rect.left, y: r.top + r.height / 2 - rect.top }
        }
      })
      setPositions(pos)
    }

    calculate()
    const t = window.setTimeout(calculate, 600)
    window.addEventListener('resize', calculate)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', calculate)
    }
  }, [core, subCore, advisory])

  const avatar = (name: string, bg = '2563eb') => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=ffffff&rounded=true&size=256`

  const containerVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
  }

  // per-node animation will be set inline so we can provide a typed delay per index

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="show" variants={containerVariant} ref={containerRef} className="relative bg-white border-2 border-black rounded-lg p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-black">Organising Committee</h2>
            <p className="text-sm text-gray-600">Meet the core and supporting teams</p>
          </div>

          {/* Core row - large photos */}
          <div className="flex items-center justify-center mb-6 overflow-x-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
              {core.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 18, delay: idx * 0.12 } }}
                  className="flex flex-col items-center gap-2"
                  ref={(el) => { nodeRefs.current[m.id] = el }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-black shadow-lg">
                    <img src={avatar(m.name)} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm text-center">
                    <div className="font-semibold text-black">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sub-core row */}
          <div className="flex items-center justify-center mb-6 overflow-x-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {subCore.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 18, delay: 0.4 + idx * 0.12 } }}
                  className="flex flex-col items-center gap-2"
                  ref={(el) => { nodeRefs.current[m.id] = el }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-black shadow-md">
                    <img src={avatar(m.name, 'f97316')} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm text-center">
                    <div className="font-semibold text-black">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Advisory row */}
          <div className="flex items-center justify-center overflow-x-auto">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {advisory.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 18, delay: 0.8 + idx * 0.12 } }}
                  className="flex flex-col items-center gap-2"
                  ref={(el) => { nodeRefs.current[m.id] = el }}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black shadow-sm">
                    <img src={avatar(m.name, '6b7280')} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm text-center">
                    <div className="font-semibold text-black">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SVG edges overlay (animated slowly) */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            {Object.keys(positions).length > 0 && (
              <>
                {/* chair connections */}
                {core.slice(1).map((c, idx) => {
                  const a = positions[core[0].id]
                  const b = positions[c.id]
                  if (!a || !b) return null
                  return (
                    <motion.path
                      key={`edge-${c.id}`}
                      d={`M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2} ${b.x} ${(a.y + b.y) / 2} ${b.x} ${b.y}`}
                      stroke="#111827"
                      strokeWidth={2}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, delay: 0.6 + idx * 0.12 }}
                    />
                  )
                })}

                {/* tech -> subcore */}
                {subCore.map((s, idx) => {
                  const tech = positions[core[2].id]
                  const node = positions[s.id]
                  if (!tech || !node) return null
                  return (
                    <motion.path
                      key={`edge-tech-${s.id}`}
                      d={`M ${tech.x} ${tech.y} C ${tech.x} ${(tech.y + node.y) / 2} ${node.x} ${(tech.y + node.y) / 2} ${node.x} ${node.y}`}
                      stroke="#6b7280"
                      strokeWidth={1.6}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, delay: 1.0 + idx * 0.12 }}
                    />
                  )
                })}

                {/* advisory -> chair */}
                {advisory.map((a, idx) => {
                  const chair = positions[core[0].id]
                  const node = positions[a.id]
                  if (!chair || !node) return null
                  return (
                    <motion.path
                      key={`edge-ad-${a.id}`}
                      d={`M ${chair.x} ${chair.y} C ${chair.x} ${(chair.y + node.y) / 2} ${node.x} ${(chair.y + node.y) / 2} ${node.x} ${node.y}`}
                      stroke="#f97316"
                      strokeWidth={1.6}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.8, delay: 1.6 + idx * 0.14 }}
                    />
                  )
                })}
              </>
            )}
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
