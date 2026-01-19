"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"

// Code templates for the moving strip
const codeTemplates = [
  {
    name: "two_sum.py",
    language: "Python",
    code: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target-num], i]\n        seen[num] = i`,
    status: "Accepted",
    runtime: "4ms",
  },
  {
    name: "binary_search.cpp",
    language: "C++",
    code: `int binarySearch(vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        arr[mid] < target ? left = mid + 1 : right = mid - 1;\n    }\n    return -1;\n}`,
    status: "Accepted",
    runtime: "2ms",
  },
  {
    name: "merge_sort.java",
    language: "Java",
    code: `void mergeSort(int[] arr, int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n}`,
    status: "Accepted",
    runtime: "8ms",
  },
  {
    name: "dfs.js",
    language: "JavaScript",
    code: `function dfs(graph, node, visited = new Set()) {\n    if (visited.has(node)) return;\n    visited.add(node);\n    console.log(node);\n    for (const neighbor of graph[node]) {\n        dfs(graph, neighbor, visited);\n    }\n}`,
    status: "Accepted",
    runtime: "5ms",
  },
  {
    name: "dp_fibonacci.rs",
    language: "Rust",
    code: `fn fibonacci(n: usize) -> u64 {\n    let mut dp = vec![0u64; n + 1];\n    dp[1] = 1;\n    for i in 2..=n {\n        dp[i] = dp[i-1] + dp[i-2];\n    }\n    dp[n]\n}`,
    status: "Accepted",
    runtime: "1ms",
  },
  {
    name: "quick_sort.go",
    language: "Go",
    code: `func quickSort(arr []int, low, high int) {\n    if low < high {\n        pi := partition(arr, low, high)\n        quickSort(arr, low, pi-1)\n        quickSort(arr, pi+1, high)\n    }\n}`,
    status: "Accepted",
    runtime: "3ms",
  },
]

// Duplicate for seamless loop
const duplicatedTemplates = [...codeTemplates, ...codeTemplates]

export function About() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function CarouselStrip() {
    if (!mounted) return null

    return (
      <div className="mb-8 overflow-hidden rounded-lg border-2 border-black bg-white">
        <div className="relative">
          <div className="py-3 px-4 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-orange-50 border-b border-black">
            <div className="text-sm font-semibold text-black">Live Submissions</div>
          </div>

          <div className="overflow-hidden">
            <div className="whitespace-nowrap will-change-transform" style={{ display: 'flex', gap: '1rem', padding: '12px', animation: 'scroll 30s linear infinite' }}>
              {duplicatedTemplates.map((t, i) => (
                <div key={i} className="inline-block w-80 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-black">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.language}</div>
                  </div>
                  <pre className="text-xs font-mono text-gray-700 max-h-20 overflow-hidden">{t.code.split('\n').slice(0,4).join('\n')}</pre>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-green-600 font-semibold">{t.status}</div>
                    <div className="text-xs text-gray-500">{t.runtime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <section id="about" className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel strip */}
        <CarouselStrip />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-black mb-4">About SCPC 2026</h2>
          <p className="text-lg text-gray-600">Caliber Isn't Claimed; It's Conquered</p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white border-2 border-black rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To foster innovation and competitive excellence among the next generation of programmers and developers. TCET SHASTRA is a platform where talent meets opportunity, ideas transform into solutions, and dreams turn into achievements.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white border-2 border-black rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold text-black mb-4">Why Participate?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Showcase your coding skills on a competitive platform</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Win ₹90,000 in prizes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Network with 500+ participants from 15+ colleges</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Gain recognition and internship opportunities</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Event Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border-2 border-black rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-black mb-6 text-center">Event Highlights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-700 font-semibold">Participants Expected</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">15+</div>
              <p className="text-gray-700 font-semibold">Colleges</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">12</div>
              <p className="text-gray-700 font-semibold">Hours Duration</p>
            </div>
          </div>
        </motion.div>

        {/* Competition Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 bg-gray-100 border-2 border-black rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-black mb-6 text-center">Competition Structure</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl font-bold text-blue-600 mb-3">Round 1</div>
              <p className="text-gray-700 font-semibold mb-2">Online Qualifier</p>
              <p className="text-sm text-gray-600">Competitive programming challenges to filter top teams</p>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl font-bold text-blue-600 mb-3">Round 2</div>
              <p className="text-gray-700 font-semibold mb-2">Main Event</p>
              <p className="text-sm text-gray-600">12-hour hackathon with real-world problem statements</p>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="text-4xl font-bold text-blue-600 mb-3">Round 3</div>
              <p className="text-gray-700 font-semibold mb-2">Presentation</p>
              <p className="text-sm text-gray-600">Final presentations and judging by industry experts</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
