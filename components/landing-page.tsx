"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Zap, Gift, Smile } from "lucide-react"

export function LandingPage({ onStartScan }: { onStartScan: () => void }) {
  return (
    <div className="min-h-screen w-full bg-primary flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-30"
            animate={{ y: [-20, 20], x: [-10, 10], rotate: [0, 360] }}
            transition={{ duration: 4 + i, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ left: `${15 + i * 20}%`, top: `${10 + i * 15}%` }}
          >
            {i % 2 === 0 ? "🍕" : "🔫"}
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
          className="mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-6xl font-black text-accent drop-shadow-[4px_4px_0_rgba(0,0,0,1)] -rotate-6 tracking-tighter uppercase leading-none">
            MA CHE<br/>FAME !
          </div>
        </motion.div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          PIZZA LA VISTA BABY
        </h1>

        {/* Info Card */}
        <div className="bg-white border-4 border-black rounded-xl p-6 mb-8 shadow-[8px_8px_0_rgba(0,0,0,0.2)] transform -rotate-1">
          <h2 className="text-2xl font-black text-black mb-4 uppercase">Comment ça marche ?</h2>

          <div className="space-y-4">
            {[
              { icon: Zap, number: 1, text: "Lance la roue (1 fois / jour)" },
              { icon: Gift, number: 2, text: "Gagne un cadeau de ouf" },
              { icon: Smile, number: 3, text: "Récupère-le en caisse" },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-secondary border-2 border-black flex items-center justify-center text-white font-bold flex-shrink-0 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                  {step.number}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-black font-bold uppercase text-sm">{step.text}</p>
                </div>
                <step.icon className="w-5 h-5 text-secondary flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <motion.div className="mb-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onClick={onStartScan}
            className="w-full bg-accent text-black font-black text-xl py-8 rounded-xl border-4 border-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all uppercase"
          >
            🎰 JE TENTE MA CHANCE !
          </Button>
        </motion.div>

        <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
          *Une participation par jour max
        </p>
      </motion.div>
    </div>
  )
}
