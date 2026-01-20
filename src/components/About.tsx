"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// --- DATA & ASSETS ---
const codeTemplates = [
  {
    name: "two_sum.py",
    language: "Python",
    code: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target-num], i]`,
    status: "Accepted",
    runtime: "4ms",
    color: "text-blue-600"
  },
  {
    name: "binary_search.cpp",
    language: "C++",
    code: `int binarySearch(vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;`,
    status: "Accepted",
    runtime: "2ms",
    color: "text-purple-600"
  },
  {
    name: "merge_sort.java",
    language: "Java",
    code: `void mergeSort(int[] arr, int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);`,
    status: "Accepted",
    runtime: "8ms",
    color: "text-orange-600"
  },
  {
    name: "dfs.js",
    language: "JavaScript",
    code: `function dfs(graph, node, visited = new Set()) {\n    if (visited.has(node)) return;\n    visited.add(node);\n    console.log(node);`,
    status: "Accepted",
    runtime: "5ms",
    color: "text-yellow-600"
  },
]

const duplicatedTemplates = [...codeTemplates, ...codeTemplates, ...codeTemplates]

// --- SUB-COMPONENTS ---

function CarouselStrip() {
  return (
    <div className="w-full overflow-hidden border-y border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-gray-50 to-transparent"></div>
        <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-gray-50 to-transparent"></div>
        
        <div className="flex py-6">
          <div 
            className="flex gap-6 whitespace-nowrap will-change-transform" 
            style={{ animation: 'scroll 40s linear infinite' }}
          >
            {duplicatedTemplates.map((t, i) => (
              <div key={i} className="inline-block w-[300px] shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1">
                {/* Header (VS Code Tab style) */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${t.language === "C++" ? "bg-blue-500" : t.language === "Python" ? "bg-yellow-500" : "bg-green-500"}`}></div>
                    <span className="font-mono text-xs font-medium text-gray-600">{t.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{t.language}</span>
                </div>
                
                {/* Code Body */}
                <div className="bg-white p-3">
                  <pre className="font-mono text-[10px] leading-relaxed text-gray-600 opacity-80">
                    {t.code}
                  </pre>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
                    <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
                      {t.status}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400">
                      Runtime: {t.runtime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ title, subtitle, desc, index }: { title: string, subtitle: string, desc: string, index: number }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-blue-500 hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
      {/* Background Grid Pattern on Hover */}
      <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
           style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '8px 8px' }}>
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between">
            <div className="inline-block rounded border border-blue-100 bg-blue-50 px-3 py-1 font-mono text-xs font-semibold text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            func round_{index}()
            </div>
            <span className="translate-x-4 font-mono text-xl font-bold text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                -&gt;
            </span>
        </div>

        <h4 className="mb-3 text-2xl font-bold text-gray-900 group-hover:text-blue-700">{title}</h4>
        <p className="mb-4 font-mono text-sm font-medium text-gray-500">{subtitle}</p>
        {/* Increased text size and spacing here */}
        <p className="flex-grow text-base leading-7 text-gray-600">{desc}</p>
      </div>
    </div>
  )
}

export function About() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section id="about" className="relative overflow-hidden bg-gray-50 py-24">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-40" 
           style={{ 
             backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
             backgroundSize: '24px 24px' 
           }}>
      </div>

      <div className="relative z-10">
        
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-6 w-max rounded-full border border-gray-200 bg-white px-5 py-2 shadow-sm"
          >
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </span>
              System Online
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SCPC 2026</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="font-mono text-xl text-gray-500"
          >
            &lt;Caliber Isn't Claimed; It's Conquered /&gt;
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="mb-24">
            <CarouselStrip />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Mission (Left) & Verdict Stats (Right) */}
          <div className="mb-24 grid gap-12 lg:grid-cols-2">
            
            {/* LEFT COLUMN: Mission Text */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-10 shadow-sm"
            >
              <h3 className="mb-8 font-mono text-3xl font-bold text-gray-900">
                <span className="text-blue-600">#</span> define MISSION
              </h3>
              {/* Increased Text Size and Leading */}
              <p className="text-xl leading-8 text-gray-600">
                To foster innovation and competitive excellence among the next generation of programmers. 
                <span className="font-semibold text-gray-900"> TCET SHASTRA</span> is where talent meets runtime constraints, and ideas transform into O(1) solutions.
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center hover:bg-blue-50 transition-colors">
                   <div className="text-4xl font-bold text-blue-600 mb-1">₹90k</div>
                   <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Prize Pool</div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center hover:bg-blue-50 transition-colors">
                   <div className="text-4xl font-bold text-blue-600 mb-1">500+</div>
                   <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Coders</div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: The "Verdict Pass" Stats */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
               {[
                 { label: "Colleges", val: "15+", icon: "🏛️", varName: "n_colleges" },
                 { label: "Duration", val: "12h", icon: "⏳", varName: "time_limit" },
                 { label: "Problem Sets", val: "Hard", icon: "💀", varName: "difficulty" },
                 { label: "Opportunities", val: "Yes", icon: "💼", varName: "intern_flag" },
               ].map((stat, i) => (
                 <div key={i} className="group relative flex flex-col items-start justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:shadow-md">
                    
                    {/* Hover Progress Bar */}
                    <div className="absolute left-0 top-0 h-1.5 w-0 bg-green-500 transition-all duration-500 group-hover:w-full"></div>

                    <div className="mb-4 flex w-full items-center justify-between">
                        <span className="font-mono text-xs text-gray-400 group-hover:text-green-600">
                            var {stat.varName}
                        </span>
                        <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                            PASS
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-3xl grayscale transition-all group-hover:grayscale-0">{stat.icon}</span>
                        <div className="font-mono text-3xl font-bold text-gray-900 group-hover:text-black">
                            {stat.val}
                        </div>
                    </div>
                    
                    <div className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-wide group-hover:text-green-700">
                        {stat.label}
                    </div>
                 </div>
               ))}
            </motion.div>
          </div>

          {/* Execution Stack */}
          <div className="mb-12 text-center">
             <h3 className="font-mono text-xl font-bold uppercase tracking-[0.2em] text-gray-400">Execution Stack</h3>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative grid gap-8 md:grid-cols-3"
          >
            {/* Decorative Flow Line (Desktop Only) */}
            <div className="absolute top-1/2 hidden w-full -translate-y-1/2 border-t-2 border-dashed border-gray-200 md:block"></div>

            <FeatureCard 
              index={1} 
              title="Qualifier" 
              subtitle="Online Round" 
              desc="Standard competitive programming problems on HackerRank. Filter top teams based on AC count and penalty time." 
            />
            <FeatureCard 
              index={2} 
              title="The Hackathon" 
              subtitle="Offline Main Event" 
              desc="12-hour intense coding sprint. Solve real-world algorithm challenges and system design problem statements." 
            />
            <FeatureCard 
              index={3} 
              title="Judgment" 
              subtitle="Presentation & Viva" 
              desc="Code review and final presentations judged by industry experts from top product-based companies." 
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}