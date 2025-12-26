"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Check } from "lucide-react"

interface SuccessConfirmationProps {
  userName: string
  userEmail: string
  prize: {
    id: string
    name: string
    emoji: string
  }
  onComplete: () => void
}

export function SuccessConfirmation({ userName, userEmail, prize, onComplete }: SuccessConfirmationProps) {
  return (
    <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center px-4 py-8 font-sans">
      <motion.div
        className="w-full max-w-md text-center bg-white border-4 border-black p-8 shadow-[12px_12px_0_#000] relative transform rotate-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Pizza Steve Celebration */}
        <motion.div
            className="absolute -top-20 -right-8 w-32 h-32 md:w-40 md:h-40 z-20 pointer-events-none"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ delay: 0.6, type: "spring" }}
        >
             <img src="/pizza_steve.png" alt="Pizza Steve" className="w-full h-full object-contain drop-shadow-[4px_4px_0_#000]" />
        </motion.div>

        {/* Success Checkmark */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          <div className="relative">
            <div className="w-24 h-24 bg-[#000] flex items-center justify-center border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
              <Check className="w-12 h-12 text-[#FF007F] font-bold" strokeWidth={4} />
            </div>
          </div>
        </motion.div>

        {/* Success Title */}
        <motion.h1
          className="text-4xl font-black text-[#FF007F] mb-2 uppercase drop-shadow-[2px_2px_0_#000]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          MA CHE BRAVO !
        </motion.h1>

        <motion.p
          className="text-black mb-8 font-bold text-lg uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Ton cadeau t'attend !
        </motion.p>

        {/* Confirmation Details Card */}
        <motion.div
          className="bg-[#FFFDD0] border-4 border-black p-4 mb-8 space-y-4 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Prize Won */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-black border-dashed">
            <span className="text-black font-bold uppercase text-sm">Cadeau:</span>
            <span className="text-lg font-black text-[#FF007F]">
              {prize.emoji} {prize.name}
            </span>
          </div>

          {/* Name */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-black border-dashed">
            <span className="text-black font-bold uppercase text-sm">Prénom:</span>
            <span className="font-bold text-black uppercase">{userName}</span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <span className="text-black font-bold uppercase text-sm">Email:</span>
            <span className="font-bold text-black uppercase">{userEmail}</span>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="bg-[#FF4500] border-4 border-black p-4 mb-8 text-white shadow-[4px_4px_0_#000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm font-black uppercase">
            ⚠️ Présente cet écran au comptoir pour récupérer ton cadeau.
          </p>
        </motion.div>

        {/* Footer Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={onComplete}
            className="w-full bg-black text-white font-black text-xl py-6 border-4 border-black hover:bg-zinc-800 transition-all uppercase rounded-none"
          >
            TERMINÉ
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
