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
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-8 font-sans">
      <motion.div
        className="w-full max-w-md text-center bg-white rounded-xl p-6 shadow-[8px_8px_0_rgba(0,0,0,0.2)] border-4 border-black"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
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
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
              <Check className="w-12 h-12 text-white font-bold" />
            </div>
          </div>
        </motion.div>

        {/* Success Title */}
        <motion.h1
          className="text-3xl font-black text-black mb-2 uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          MA CHE BRAVO !
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-8 font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Ton cadeau t'attend sagement.
        </motion.p>

        {/* Confirmation Details Card */}
        <motion.div
          className="bg-muted rounded-xl p-4 border-2 border-black mb-8 space-y-4 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Prize Won */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-gray-300">
            <span className="text-gray-600 font-bold uppercase text-sm">Cadeau:</span>
            <span className="text-lg font-black text-primary">
              {prize.emoji} {prize.name}
            </span>
          </div>

          {/* Name */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-gray-300">
            <span className="text-gray-600 font-bold uppercase text-sm">Prénom:</span>
            <span className="font-bold text-black">{userName}</span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-bold uppercase text-sm">Email:</span>
            <span className="font-bold text-black">{userEmail}</span>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="bg-accent/20 border-2 border-accent rounded-lg p-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-black font-bold">
            ℹ️ Présente ce ticket (ou ton email de confirmation) en caisse pour récupérer ton lot.
          </p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onComplete}
            className="w-full bg-accent text-black font-black text-xl py-6 rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all uppercase"
          >
            C'EST NOTÉ !
          </Button>
        </motion.div>

        {/* Footer Text */}
        <p className="text-sm text-gray-500 mt-6 font-bold uppercase">Tes cadeaux sont bien au chaud.</p>
      </motion.div>
    </div>
  )
}
