"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import React from 'react';
import { ArrowRight, Terminal, Layers, Cpu } from 'lucide-react';

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
    color: "text-blue-600"
  },
  {
    name: "merge_sort.java",
    language: "Java",
    code: `void mergeSort(int[] arr, int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);`,
    status: "Accepted",
    runtime: "8ms",
    color: "text-blue-600"
  },
  {
    name: "dfs.js",
    language: "JavaScript",
    code: `function dfs(graph, node, visited = new Set()) {\n    if (visited.has(node)) return;\n    visited.add(node);\n    console.log(node);`,
    status: "Accepted",
    runtime: "5ms",
    color: "text-blue-600"
  },
]

const duplicatedTemplates = [...codeTemplates, ...codeTemplates, ...codeTemplates]

// --- SUB-COMPONENTS ---

// 1. CAROUSEL
function CarouselStrip() {
  return (
    <div className="w-full max-w-7xl mx-auto mb-20">
      {/* The Retro Container */}
      <div className="overflow-hidden rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Header */}
        <div className="py-3 px-4 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-orange-50 border-b border-black">
           <div className="text-sm font-semibold text-black">Live Submissions</div>
        </div>

        {/* Scrolling Content */}
        <div className="relative bg-white">
          <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent"></div>
          <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent"></div>
          
          <div className="flex py-4">
            <div 
              className="flex gap-6 whitespace-nowrap will-change-transform" 
              style={{ animation: 'scroll 40s linear infinite' }}
            >
              {duplicatedTemplates.map((t, i) => (
                <div key={i} className="inline-block w-[300px] shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-transform hover:-translate-y-1">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="font-mono text-xs font-medium text-gray-600">{t.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{t.language}</span>
                  </div>
                  
                  {/* Card Body */}
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

// 2. CLEAN PIPELINE
function ExecutionPipeline() {
  const steps = [
    {
      title: "Qualifier",
      type: "Online Round",
      desc: "HackerRank filtering based on AC count & penalty time.",
      icon: <Terminal className="w-6 h-6" />
    },
    {
      title: "The Hackathon",
      type: "Offline Main",
      desc: "12-hour sprint solving real-world algo challenges.",
      icon: <Cpu className="w-6 h-6" />
    },
    {
      title: "Judgment",
      type: "Final Viva",
      desc: "Code review by experts from product-based companies.",
      icon: <Layers className="w-6 h-6" />
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="rounded-xl border border-blue-200 bg-white shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100">
           {steps.map((step, i) => (
             <div key={i} className="group relative p-10 min-h-[280px] transition-colors hover:bg-blue-50/30 flex flex-col h-full">
                
                {/* Index Marker */}
                <div className="absolute top-6 right-6 font-mono text-sm text-blue-300 group-hover:text-blue-500 transition-colors">
                  [{i}]
                </div>

                {/* Connection Arrow */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 z-10 text-blue-200 transform -translate-y-1/2 translate-x-1/2">
                    <ArrowRight className="w-8 h-8 bg-white rounded-full p-1" />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col h-full justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {step.icon}
                    </div>
                    <div className="font-mono text-sm text-blue-500 font-medium px-3 py-1.5 rounded-md bg-blue-50/50 border border-blue-100">
                        void step_{i+1}()
                    </div>
                  </div>
                  
                  {/* Bigger Fonts */}
                  <h4 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h4>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
             </div>
           ))}
        </div>
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

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        
        {/* 1. Live Submissions (AT TOP) */}
        <CarouselStrip />

        {/* 2. Header */}
        <div className="mb-20 text-center">
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

        <div className="mx-auto max-w-7xl">
          
          {/* Mission & STICKER STATS */}
          <div className="mb-32 grid gap-12 lg:grid-cols-2">
            
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

            {/* RIGHT COLUMN: Blue/White Stickers with ORANGE TAPE */}
            <motion.div 
               className="grid grid-cols-2 gap-6"
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
               {/* Sticker 1: Colleges */}
               <motion.div 
                  className="relative group mt-6"
                  whileHover={{ rotate: 0, scale: 1.05, y: -10, zIndex: 20 }}
                  initial={{ rotate: -2 }}
               >
                  {/* Tape (Orange) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#f97316] rotate-2 shadow-sm z-10 border border-orange-400/50 backdrop-blur-sm opacity-90"></div>
                  
                  <div className="bg-white rounded-xl p-5 shadow-xl h-full border border-blue-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="font-mono text-xs text-blue-500 mb-1">var n_colleges</div>
                      <div className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">15+</div>
                      <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-50 rounded-full"></div>
                  </div>
               </motion.div>

               {/* Sticker 2: Duration */}
               <motion.div 
                  className="relative group"
                  whileHover={{ rotate: 0, scale: 1.05, y: -10, zIndex: 20 }}
                  initial={{ rotate: 3 }}
               >
                  {/* Tape (Orange) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#f97316] -rotate-1 shadow-sm z-10 border border-orange-400/50 opacity-90"></div>
                  
                  <div className="bg-white rounded-xl p-5 shadow-xl h-full border border-blue-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="font-mono text-xs text-blue-500 mb-1">const duration</div>
                      <div className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">12h</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
               </motion.div>

               {/* Sticker 3: Problem Sets */}
               <motion.div 
                  className="relative group mt-6"
                  whileHover={{ rotate: 0, scale: 1.05, y: -10, zIndex: 20 }}
                  initial={{ rotate: 2 }}
               >
                  {/* Tape (Orange) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#f97316] -rotate-2 shadow-sm z-10 border border-orange-400/50 opacity-90"></div>
                  
                  <div className="bg-white rounded-xl p-5 shadow-xl h-full border border-blue-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="font-mono text-xs text-blue-500 mb-1">enum difficulty</div>
                      <div className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">HARD</div>
                      <div className="inline-block px-2 py-0.5 bg-blue-50 rounded text-[10px] font-bold text-blue-600">
                        O(N log N)
                      </div>
                    </div>
                     <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '8px 8px'}}></div>
                  </div>
               </motion.div>

               {/* Sticker 4: Internships */}
               <motion.div 
                  className="relative group"
                  whileHover={{ rotate: 0, scale: 1.05, y: -10, zIndex: 20 }}
                  initial={{ rotate: -1 }}
               >
                  {/* Tape (Orange) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#f97316] rotate-1 shadow-sm z-10 border border-orange-400/50 opacity-90"></div>
                  
                  <div className="bg-white rounded-xl p-5 shadow-xl h-full border border-blue-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm z-20"></div>
                    
                    <div className="relative z-10">
                      <div className="font-mono text-xs text-blue-500 mb-1">bool hired</div>
                      <div className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">YES</div>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                         <span className="text-[10px] font-bold text-blue-600">INTERNSHIPS</span>
                      </div>
                    </div>
                  </div>
               </motion.div>
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
          >
             <ExecutionPipeline />
          </motion.div>

        </div>
      </div>
    </section>
  )
}