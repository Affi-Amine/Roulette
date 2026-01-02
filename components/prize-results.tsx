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

  const isLoss = prize.name.toLowerCase().includes("better luck") || prize.name.toLowerCase().includes("perdu") || prize.name.toLowerCase().includes("try again") || prize.name.toLowerCase().includes("dommage") || prize.name.toLowerCase().includes("pas de chance")

  if (isLoss) {
    return (
      <div className="min-h-[100dvh] bg-[#FFFDD0] flex items-center justify-center px-4 py-8 font-sans relative overflow-x-hidden">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0_#000] relative text-center">
            
            <div className="text-6xl md:text-7xl mb-6">
              😅
            </div>

            <h1 className="text-3xl md:text-4xl font-black uppercase text-[#FF007F] mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              PAS DE CHANCE !
            </h1>

            <p className="text-black font-black uppercase text-lg md:text-xl mb-8 leading-tight">
              C'EST VIDE ! RÉESSAIE AVEC UN AUTRE TICKET DE CAISSE !
            </p>

            <div className="bg-[#FFFDD0] border-4 border-black p-6 mb-8 text-left shadow-[4px_4px_0_#000]">
              <h3 className="font-black uppercase text-lg mb-2">PROCHAINES ÉTAPES :</h3>
              <div className="h-0.5 w-full bg-black border-t-2 border-dashed border-black mb-4 opacity-50"></div>
              <ul className="space-y-4 font-bold uppercase text-sm md:text-base">
                <li className="flex items-center gap-2">
                  <span className="text-[#FF4500]">●</span> MANGE PLUS DE PIZZAS 🍕
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF4500]">●</span> SCANNE TES TICKETS 🎟️
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF4500]">●</span> GAGNE DES CADEAUX 🎁
                </li>
              </ul>
            </div>

            <Button
              onClick={onBack}
              className="w-full bg-black hover:bg-zinc-800 text-white font-black text-xl py-6 border-4 border-black uppercase rounded-none transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
            >
              RETOUR À L'ACCUEIL
            </Button>

          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[#24d6dd] flex items-center justify-center px-4 py-8 font-sans relative overflow-x-hidden">
      
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
          <motion.div 
              className="absolute -top-20 -left-8 md:-left-12 w-32 h-32 md:w-40 md:h-40 z-20 pointer-events-none"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: -15 }}
              transition={{ delay: 0.3, type: "spring" }}
          >
                <img src="/pizza_steve.png" alt="Pizza Steve" className="w-full h-full object-contain drop-shadow-[4px_4px_0_#000]" />
          </motion.div>

          {/* Confetti / Decor */}
          <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 text-4xl md:text-6xl rotate-12 animate-bounce">
            🎉
          </div>

          {/* Header */}
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-3xl md:text-5xl font-black uppercase mb-1 md:mb-2 drop-shadow-[2px_2px_0_#000] text-[#FF007F]">
              MAMMA MIA!
            </h1>
            <p className="text-black font-bold uppercase tracking-wide text-xs md:text-base">
              TU AS GAGNÉ :
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

          {/* Form */}
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
                className={`w-full bg-white border-4 ${errors.email ? "border-red-500" : "border-black"} p-2 md:p-3 font-bold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-black/20 transition-all`}
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
        </div>
      </motion.div>
    </div>
  )
}
