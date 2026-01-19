"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white py-12 border-t-2 border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-2">SCPC</h3>
            <p className="text-gray-400 text-sm">Shastra Competitive Programming Competition</p>
            <p className="text-gray-400 text-sm mt-1">TCET Mumbai</p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#home" className="hover:text-white transition">Home</Link></li>
              <li><Link href="#about" className="hover:text-white transition">About</Link></li>
              <li><Link href="#timeline" className="hover:text-white transition">Timeline</Link></li>
              <li><Link href="#prizes" className="hover:text-white transition">Prizes</Link></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
            </ul>
          </motion.div>

          {/* Event Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4">Event</h4>
            <p className="text-sm text-gray-400">
              <strong>Date:</strong> 15 Jan 2026
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Location:</strong> TCET, Mumbai
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Duration:</strong> 12 Hours
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} TCET SHASTRA. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Code of Conduct</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
