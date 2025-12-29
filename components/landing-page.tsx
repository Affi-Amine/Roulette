"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Zap, Gift, Smile, Ticket } from "lucide-react"

export function LandingPage({ onStartScan }: { onStartScan: (ticketId: string) => void }) {
  const [ticketInput, setTicketInput] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!ticketInput.trim()) {
      setError("Entre ton numéro de ticket !")
      return
    }
    setError("")
    onStartScan(ticketInput)
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#24d6dd] flex flex-col items-center justify-center px-4 py-8 relative overflow-x-hidden font-sans">
      
      {/* Floating Background Elements (Mascots) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { emoji: "🍕", delay: 0, x: -100, y: -100 },
          { emoji: "🤌", delay: 1, x: 100, y: -50 },
          { emoji: "🍅", delay: 2, x: -80, y: 100 },
          { emoji: "🍝", delay: 3, x: 80, y: 80 },
          { emoji: "🧀", delay: 0.5, x: 0, y: -150 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-7xl opacity-40"
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3 + i, 
              repeat: Number.POSITIVE_INFINITY, 
              ease: "easeInOut",
              delay: item.delay 
            }}
            style={{ 
              left: `calc(50% + ${item.x}px)`, 
              top: `calc(50% + ${item.y}px)` 
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-md w-full text-center flex flex-col justify-center h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0">
            {/* Brand Header */}
            <motion.div
            className="mb-4 shrink-0 flex flex-col items-center"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
                {/* Pizza Steve Mascot */}
                <motion.div
                    className="mb-[-20px] relative z-20"
                    animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                    <img 
                        src="/pizza_steve.png" 
                        alt="Pizza Steve" 
                        className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[4px_4px_0_#000]" 
                    />
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black text-[#FF007F] drop-shadow-[4px_4px_0_#000] md:drop-shadow-[6px_6px_0_#000] tracking-tighter leading-none mb-2 relative z-10">
                    MA CHE!
                </h1>
                <div className="inline-block bg-black text-white px-3 py-1 text-xs md:text-sm font-bold uppercase transform -rotate-2 relative z-10">
                    Scan et croque la dolce vita
                </div>
            </motion.div>

            {/* Steps Card */}
            <div className="bg-white border-4 border-black p-4 mb-4 shadow-[6px_6px_0_#000] md:shadow-[8px_8px_0_#000] transform rotate-1 shrink-0 w-full max-w-[320px] md:max-w-full">
            <h2 className="text-lg md:text-2xl font-black text-black mb-4 uppercase flex items-center justify-center gap-2">
                <span className="text-[#FF4500]">PICCANTE!</span> COMMENT JOUER?
            </h2>

            <div className="space-y-3 text-left">
                {[
                { icon: Ticket, text: "Lance la machine (1x/jour)", color: "bg-[#FF007F]" },
                { icon: Gift, text: "Gagne un cadeau de ouf", color: "bg-[#FF4500]" },
                { icon: Smile, text: "Récupère-le au comptoir", color: "bg-[#000]" },
                ].map((step, idx) => (
                <motion.div
                    key={idx}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                >
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${step.color} border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0_#000] flex-shrink-0`}>
                    <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <p className="text-black font-bold uppercase text-xs md:text-sm leading-tight">
                    {step.text}
                    </p>
                </motion.div>
                ))}
            </div>
            </div>

            {/* Ticket Input & CTA */}
            <motion.div 
            className="shrink-0 w-full max-w-[320px] md:max-w-full flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="NUMÉRO DE TICKET"
                  value={ticketInput}
                  onChange={(e) => {
                    setTicketInput(e.target.value)
                    if (error) setError("")
                  }}
                  className="w-full bg-white border-4 border-black p-4 text-center font-bold text-xl uppercase placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#FF007F] shadow-[4px_4px_0_#000]"
                />
                {error && (
                  <p className="absolute -bottom-6 left-0 right-0 text-[#FF007F] text-xs font-black uppercase">
                    {error}
                  </p>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-black text-xl md:text-2xl py-6 md:py-8 border-4 border-black shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-y-[2px] transition-all uppercase rounded-none"
                >
                    TENTER MA CHANCE 🎲
                </Button>
              </motion.div>
            </motion.div>

            <p className="mt-4 text-black/60 text-[10px] md:text-xs font-bold uppercase tracking-widest shrink-0">
            *Une participation par jour max
            </p>

            {/* Social Icons (Mockup) */}
            <div className="mt-4 flex justify-center gap-4 text-black opacity-50 shrink-0">
                {/* Social Icons using Lucide or text */}
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full hover:scale-110 transition-transform cursor-pointer">
                    <span className="font-bold text-xs">IG</span>
                </div>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full hover:scale-110 transition-transform cursor-pointer">
                    <span className="font-bold text-xs">TK</span>
                </div>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full hover:scale-110 transition-transform cursor-pointer">
                    <span className="font-bold text-xs">FB</span>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  )
}
