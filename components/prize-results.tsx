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

  return (
    <div className="min-h-screen bg-[#fffcf5] flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Celebration Header */}
        <motion.div
          className="text-center mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <h1 className="text-4xl font-bold text-[#e63946] mb-2 font-black uppercase">Félicitations !</h1>
          <p className="text-black font-medium">Tu as gagné un cadeau !</p>
        </motion.div>

        {/* Prize Card with Glow */}
        <motion.div
          className="relative mb-8 p-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-black"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Brand Glow Background */}
          <div
            className="absolute inset-0 opacity-20 blur-3xl"
            style={{
              background: `radial-gradient(circle at center, #f9c80e, transparent)`,
            }}
          />

          <div className="relative z-10 text-center">
            {/* Prize Emoji */}
            <motion.div
              className="text-8xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {prize.emoji}
            </motion.div>

            {/* Prize Name */}
            <h2 className="text-2xl font-bold text-black mb-2 font-black uppercase">{prize.name}</h2>

            {/* Prize Badge */}
            <div
              className="inline-block px-4 py-2 rounded-full text-white font-semibold"
              style={{ backgroundColor: prize.color }}
            >
              Gagné !
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
              Prénom
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: undefined })
              }}
              placeholder="Ton prénom"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                errors.name ? "border-[#e63946] bg-red-50" : "border-black focus:border-[#e63946]"
              } focus:outline-none bg-white text-black`}
            />
            {errors.name && (
              <motion.p
                className="text-[#e63946] text-sm mt-1 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
              Adresse Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: undefined })
              }}
              placeholder="ton.email@exemple.com"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                errors.email ? "border-[#e63946] bg-red-50" : "border-black focus:border-[#e63946]"
              } focus:outline-none bg-white text-black`}
            />
            {errors.email && (
              <motion.p
                className="text-[#e63946] text-sm mt-1 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#e63946] hover:bg-[#d62839] disabled:opacity-50 text-white font-bold text-lg py-6 rounded-xl shadow-lg transition-all uppercase"
            >
              {isSubmitting ? "Enregistrement..." : "RÉCUPÉRER MON CADEAU !"}
            </Button>
          </motion.div>

          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-black hover:text-[#e63946] font-semibold py-2 transition-colors hidden"
          >
            Back to Home
          </button>
        </motion.form>

        {/* Trust Note */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Your information is secure and will only be used to process your prize.</p>
        </div>
      </motion.div>
    </div>
  )
}
