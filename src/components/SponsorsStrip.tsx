"use client"

import { motion } from "framer-motion"

// Sponsor data - replace with actual sponsors
const sponsors = [
    { name: "Google", logo: "G" },
    { name: "Microsoft", logo: "⊞" },
    { name: "Apple", logo: "" },
    { name: "Netflix", logo: "N" },
    { name: "Amazon", logo: "A" },
    { name: "Meta", logo: "∞" },
    { name: "GitHub", logo: "◐" },
    { name: "Vercel", logo: "▲" },
]

// Duplicate for infinite scroll effect
const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors]

export function SponsorsStrip() {
    return (
        <section className="relative bg-white py-16 overflow-hidden border-y border-gray-200">
            {/* Background grid pattern - matching About section */}
            <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10">
                {/* Header - IDE style */}
                <motion.div
                    className="text-center mb-12 px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Code-style header */}
                    <div className="inline-block mb-4">
                        <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">
              // sponsors.config
                        </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Backed by{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Industry Leaders
                        </span>
                    </h3>
                    <p className="text-gray-500 font-mono text-sm">
                        &lt;Partners powering innovation /&gt;
                    </p>
                </motion.div>

                {/* Scrolling sponsors container - retro card style like About */}
                <div className="w-full max-w-7xl mx-auto px-4">
                    <div className="overflow-hidden rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

                        {/* Header bar */}
                        <div className="py-3 px-4 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-orange-50 border-b border-black">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500"></div>
                            </div>
                            <div className="text-sm font-semibold text-black font-mono">Our Sponsors</div>
                        </div>

                        {/* Scrolling Content */}
                        <div className="relative bg-white">
                            {/* Fade gradients */}
                            <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                            <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />

                            {/* Scrolling track */}
                            <div className="flex py-6 overflow-hidden">
                                <div className="flex gap-6 whitespace-nowrap will-change-transform sponsor-scroll">
                                    {duplicatedSponsors.map((sponsor, i) => (
                                        <div
                                            key={i}
                                            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer shadow-sm"
                                        >
                                            {/* Logo placeholder */}
                                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-300 transition-colors shadow-sm">
                                                <span className="text-xl font-bold text-blue-600">
                                                    {sponsor.logo}
                                                </span>
                                            </div>
                                            <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {sponsor.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-8 px-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        <span>Want to sponsor?</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
