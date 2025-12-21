"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Zap, Gift, Smile } from "lucide-react"

export function LandingPage({ onStartScan }: { onStartScan: () => void }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-red-500 via-orange-400 to-yellow-300 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating confetti-like elements in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl opacity-20"
            animate={{ y: [-20, 20], x: [-10, 10], rotate: [0, 360] }}
            transition={{ duration: 4 + i, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ left: `${20 + i * 15}%`, top: `${10 + i * 10}%` }}
          >
            🍕
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo/Brand */}
        <motion.div
          className="mb-8 text-6xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          🍕🎰
        </motion.div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Win <span className="text-yellow-300">Amazing Prizes!</span>
        </h1>

        {/* Description */}
        <p className="text-white text-lg mb-12 drop-shadow-md">
          Scan your pizza receipt QR code and spin the wheel for incredible rewards
        </p>

        {/* How It Works */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">How It Works</h2>

          <div className="space-y-4">
            {[
              { icon: Zap, number: 1, text: "Scan your receipt QR" },
              { icon: Gift, number: 2, text: "Spin the wheel" },
              { icon: Smile, number: 3, text: "Claim your prize" },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-800 font-semibold">{step.text}</p>
                </div>
                <step.icon className="w-5 h-5 text-orange-500 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <motion.div className="mb-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onClick={onStartScan}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg"
          >
            📸 SCAN TICKET QR
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-4 text-sm text-white drop-shadow-md">
          <span>✓ 100% Secure</span>
          <span>•</span>
          <span>✓ Instant Results</span>
        </div>
      </motion.div>
    </div>
  )
}
