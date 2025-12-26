"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { AlertCircle } from "lucide-react"

interface Prize {
  id: string
  name: string
  emoji: string
  image_url?: string | null
  color: string
}

interface PrizeResultsProps {
  prize: Prize
  onClaim: (name: string, phone: string) => void
  onBack: () => void
}

export function PrizeResults({ prize, onClaim, onBack }: PrizeResultsProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Le prénom est requis"
    }

    if (!email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email invalide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onClaim(name, email)
  }

  const isLoss = prize.name.toLowerCase().includes("better luck") || prize.name.toLowerCase().includes("perdu") || prize.name.toLowerCase().includes("try again") || prize.name.toLowerCase().includes("dommage")

  return (
    <div className="min-h-[100dvh] bg-[#FFFDD0] flex items-center justify-center px-4 py-8 font-sans relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#FF007F 3px, transparent 3px)", backgroundSize: "40px 40px" }}></div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Result Card */}
        <div className="bg-white border-4 border-black p-4 md:p-8 shadow-[8px_8px_0_#000] md:shadow-[12px_12px_0_#000] relative transform -rotate-1">
          
          {/* Pizza Steve for Winners */}
          {!isLoss && (
            <motion.div 
                className="absolute -top-20 -left-8 md:-left-12 w-32 h-32 md:w-40 md:h-40 z-20 pointer-events-none"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: -15 }}
                transition={{ delay: 0.3, type: "spring" }}
            >
                 <img src="/pizza_steve.png" alt="Pizza Steve" className="w-full h-full object-contain drop-shadow-[4px_4px_0_#000]" />
            </motion.div>
          )}

          {/* Confetti / Decor */}
          <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 text-4xl md:text-6xl rotate-12 animate-bounce">
            {isLoss ? "😢" : "🎉"}
          </div>

          {/* Header */}
          <div className="text-center mb-4 md:mb-8">
            <h1 className={`text-3xl md:text-5xl font-black uppercase mb-1 md:mb-2 drop-shadow-[2px_2px_0_#000] ${isLoss ? "text-black" : "text-[#FF007F]"}`}>
              {isLoss ? "OH NON..." : "MAMMA MIA!"}
            </h1>
            <p className="text-black font-bold uppercase tracking-wide text-xs md:text-base">
              {isLoss ? "C'est pas ton jour..." : "TU AS GAGNÉ :"}
            </p>
          </div>

          {/* Prize Display */}
          <div className="mb-4 md:mb-8 flex flex-col items-center justify-center bg-[#FFFDD0] border-4 border-black p-3 md:p-6 rotate-1">
             {prize.image_url ? (
                <img 
                  src={prize.image_url} 
                  alt={prize.name} 
                  className="max-h-20 md:max-h-32 max-w-full object-contain drop-shadow-md mb-2 md:mb-4"
                />
              ) : (
                <span className="text-5xl md:text-8xl drop-shadow-md filter mb-2 md:mb-4">{prize.emoji}</span>
              )}
             <h2 className="text-lg md:text-2xl font-black text-center uppercase text-black leading-tight">
               {prize.name}
             </h2>
          </div>

          {/* Form or Loss Action */}
          {!isLoss ? (
            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-black uppercase mb-1">Ton Prénom</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-white border-4 ${errors.name ? "border-red-500" : "border-black"} p-2 md:p-3 font-bold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-[#FF007F]/20 transition-all`}
                  placeholder="LUIGI"
                />
                {errors.name && <p className="text-red-500 text-[10px] md:text-xs font-bold mt-1 uppercase">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-black uppercase mb-1">Ton Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-white border-4 ${errors.email ? "border-red-500" : "border-black"} p-2 md:p-3 font-bold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-[#FF007F]/20 transition-all`}
                  placeholder="LUIGI@PIZZA.COM"
                />
                {errors.email && <p className="text-red-500 text-[10px] md:text-xs font-bold mt-1 uppercase">{errors.email}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-black text-lg md:text-xl py-4 md:py-6 border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-y-[2px] transition-all uppercase rounded-none mt-2 md:mt-4"
              >
                {isSubmitting ? "Validation..." : "RÉCUPÉRER MON CADEAU"}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="mb-4 md:mb-6 font-bold text-sm md:text-base">Retente ta chance demain !</p>
              <Button
                onClick={onBack}
                className="w-full bg-black text-white font-black text-lg md:text-xl py-4 md:py-6 border-4 border-black hover:bg-zinc-800 transition-all uppercase rounded-none"
              >
                RETOUR
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
