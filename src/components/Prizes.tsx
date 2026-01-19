"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Medal } from "lucide-react"

export function Prizes() {
  const prizeData = [
    {
      position: "1st Prize",
      amount: "₹45,000",
      icon: Trophy,
      color: "from-yellow-400 to-yellow-600",
      description: "Champion Team",
      perks: ["Trophy", "Certificate", "Internship Offer"]
    },
    {
      position: "2nd Prize",
      amount: "₹30,000",
      icon: Award,
      color: "from-gray-300 to-gray-500",
      description: "Runner Up",
      perks: ["Trophy", "Certificate", "Mentorship"]
    },
    {
      position: "3rd Prize",
      amount: "₹15,000",
      icon: Medal,
      color: "from-orange-300 to-orange-600",
      description: "Third Place",
      perks: ["Trophy", "Certificate", "Goodies"]
    }
  ]

  const specialAwards = [
    { title: "Best Innovation", prize: "₹5,000" },
    { title: "Best UI/UX", prize: "₹5,000" },
    { title: "Best Presentation", prize: "₹5,000" },
    { title: "People's Choice", prize: "₹5,000" }
  ]

  return (
    <section id="prizes" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-black mb-4">Prize Pool</h2>
          <p className="text-2xl font-bold text-blue-600">Total: ₹90,000</p>
        </motion.div>

        {/* Main Prizes */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {prizeData.map((prize, index) => {
            const Icon = prize.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, translateY: -10 }}
                className="relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${prize.color} opacity-10 rounded-lg blur-xl`}></div>

                {/* Card */}
                <div className="relative bg-white border-3 border-black rounded-lg p-8 text-center shadow-lg">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 20, scale: 1.1 }}
                    className="flex justify-center mb-4"
                  >
                    <div className={`bg-gradient-to-br ${prize.color} p-4 rounded-full`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Position */}
                  <h3 className="text-2xl font-bold text-black">{prize.position}</h3>
                  <p className="text-sm text-gray-600 mt-1">{prize.description}</p>

                  {/* Amount */}
                  <div className="mt-6 mb-6">
                    <div className="text-4xl font-bold text-black">{prize.amount}</div>
                  </div>

                  {/* Perks */}
                  <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                    {prize.perks.map((perk, idx) => (
                      <p key={idx} className="text-sm text-gray-700 font-semibold">
                        ✓ {perk}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Special Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border-2 border-black rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-black mb-6 text-center">Special Awards</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specialAwards.map((award, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-black rounded-lg p-4 text-center"
              >
                <p className="text-sm font-semibold text-black">{award.title}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">{award.prize}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Prize Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 bg-gray-100 border-2 border-black rounded-lg p-8"
        >
          <h3 className="text-xl font-bold text-black mb-6">Prize Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Main Prizes (1st, 2nd, 3rd)</span>
              <span className="text-lg font-bold text-black">₹90,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Special Awards (4 awards)</span>
              <span className="text-lg font-bold text-black">₹20,000</span>
            </div>
            <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
              <span className="text-black font-bold">Total Prize Pool</span>
              <span className="text-2xl font-bold text-blue-600">₹110,000</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
