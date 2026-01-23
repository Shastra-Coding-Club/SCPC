'use client'

import React from 'react';
import { motion } from 'framer-motion';

const prizes = [
    {
        position: "1st",
        title: "First Prize",
        amount: "₹45,000",
        description: "Champion Team",
        perks: ["Trophy", "Certificate", "Internship Offer", "Swag Kit"],
        accent: "#FFB800",
        filename: "first_prize.cpp"
    },
    {
        position: "2nd",
        title: "Second Prize",
        amount: "₹30,000",
        description: "Runner Up",
        perks: ["Trophy", "Certificate", "Mentorship", "Swag Kit"],
        accent: "#94A3B8",
        filename: "second_prize.cpp"
    },
    {
        position: "3rd",
        title: "Third Prize",
        amount: "₹15,000",
        description: "Second Runner Up",
        perks: ["Trophy", "Certificate", "Goodies", "Swag Kit"],
        accent: "#C4956A",
        filename: "third_prize.cpp"
    },
    {
        position: "★",
        title: "Total Prize Pool",
        amount: "₹90,000+",
        description: "Up for Grabs",
        perks: ["Best UI/UX", "Innovation Award", "People's Choice"],
        accent: "#8B5CF6",
        filename: "total_pool.cpp"
    }
];

const stats = [
    { value: "₹90K+", label: "Total Prize Pool" },
    { value: "50+", label: "Participating Teams" },
    { value: "24hrs", label: "Of Innovation" },
    { value: "100%", label: "Learning Experience" }
];

// macOS-style Prize Card
const PrizeCard = ({ data, index }) => {
    const { position, title, amount, description, perks, accent, filename } = data;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group shrink-0 w-[320px] md:w-[360px]"
        >
            {/* macOS Window Container */}
            <div className="bg-white/40 backdrop-blur-md border border-black/20 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">

                {/* Window Header with Traffic Lights */}
                <div className="bg-gray-100/80 backdrop-blur-sm px-4 py-3 border-b border-black/10 flex items-center justify-between">
                    {/* Traffic Light Buttons */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] hover:brightness-90 cursor-pointer transition-all" />
                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#DEA123] hover:brightness-90 cursor-pointer transition-all" />
                        <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] hover:brightness-90 cursor-pointer transition-all" />
                    </div>

                    {/* Filename */}
                    <span className="text-xs font-mono text-gray-600 font-medium">
                        {filename}
                    </span>

                    {/* Position Badge */}
                    <div
                        className="px-2.5 py-1 rounded-md text-xs font-bold"
                        style={{ backgroundColor: `${accent}25`, color: accent }}
                    >
                        {position}
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6 bg-white/30 backdrop-blur-sm flex flex-col">
                    {/* Amount */}
                    <div className="mb-4">
                        <div className="font-mono text-xs text-gray-500 mb-1">
                            const prize =
                        </div>
                        <div
                            className="text-4xl md:text-5xl font-black tracking-tight"
                            style={{ color: accent }}
                        >
                            {amount}
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div className="mb-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
                        <p className="text-gray-500 text-sm font-mono">// {description}</p>
                    </div>

                    {/* Perks as Code Array */}
                    <div className="bg-gray-900/5 rounded-xl p-4 border border-gray-200/50 flex-grow">
                        <div className="font-mono text-xs text-gray-500 mb-2">
                            perks[] = {'{'}
                        </div>
                        <div className="space-y-2 pl-4">
                            {perks.map((perk, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span className="text-gray-400 font-mono text-xs">{idx}:</span>
                                    <span
                                        className="font-medium px-2 py-0.5 rounded"
                                        style={{ backgroundColor: `${accent}15`, color: '#374151' }}
                                    >
                                        "{perk}"
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="font-mono text-xs text-gray-500 mt-2">
                            {'}'}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export function CardsParallax() {
    return (
        <section
            id="prizes"
            className="relative bg-gray-50 py-20 overflow-hidden"
        >
            {/* Background grid pattern */}
            <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <span className="font-mono text-sm text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                            // prizes.total = ₹90,000+
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4"
                    >
                        Compete for{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                            Glory
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-gray-500 text-lg max-w-xl mx-auto"
                    >
                        Win exciting prizes and recognition for your innovative solutions
                    </motion.p>
                </div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto mb-16 px-4"
                >
                    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-black/10 shadow-lg p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Horizontal Scrolling Cards */}
                <div className="relative">
                    {/* Fade gradients */}
                    <div className="absolute left-0 top-0 z-10 h-full w-16 md:w-32 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 z-10 h-full w-16 md:w-32 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

                    {/* Scrollable container */}
                    <div className="overflow-x-auto scrollbar-hide pb-4">
                        <div className="flex gap-6 px-8 md:px-16 lg:px-32 py-4" style={{ width: 'max-content' }}>
                            {prizes.map((prize, index) => (
                                <PrizeCard key={index} data={prize} index={index} />
                            ))}
                        </div>
                    </div>

                    {/* Scroll hint */}
                    <div className="text-center mt-4">
                        <span className="text-sm text-gray-400 font-medium">
                            ← Scroll to explore →
                        </span>
                    </div>
                </div>

                {/* Special Recognition Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto mt-16 px-4"
                >
                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-black/10 shadow-lg">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="font-mono text-xs text-blue-500 mb-2 uppercase tracking-wider">
                                    // everyone.wins()
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900">
                                    All participants receive certificates & mementos
                                </div>
                            </div>
                            <a
                                href="#register"
                                className="shrink-0 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg"
                            >
                                Register Now
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}