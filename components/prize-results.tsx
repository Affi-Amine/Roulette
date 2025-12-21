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
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\d\s+()-]+$/.test(phone)) {
      newErrors.phone = "Invalid phone number"
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

    onClaim(name, phone)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center px-4 py-8">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Congratulations!</h1>
          <p className="text-gray-600">You won an amazing prize!</p>
        </motion.div>

        {/* Prize Card with Glow */}
        <motion.div
          className="relative mb-8 p-8 bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Golden Glow Background */}
          <div
            className="absolute inset-0 opacity-20 blur-3xl"
            style={{
              background: `radial-gradient(circle at center, #FCBF49, transparent)`,
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{prize.name}</h2>

            {/* Prize Badge */}
            <div
              className="inline-block px-4 py-2 rounded-full text-white font-semibold"
              style={{ backgroundColor: prize.color }}
            >
              You Won!
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
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: undefined })
              }}
              placeholder="Enter your name"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-600"
              } focus:outline-none bg-white`}
            />
            {errors.name && (
              <motion.p
                className="text-red-600 text-sm mt-1 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                if (errors.phone) setErrors({ ...errors, phone: undefined })
              }}
              placeholder="+216 XX XXX XXX"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-600"
              } focus:outline-none bg-white`}
            />
            {errors.phone && (
              <motion.p
                className="text-red-600 text-sm mt-1 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:opacity-50 text-white font-bold text-lg py-6 rounded-xl shadow-lg transition-all"
            >
              {isSubmitting ? "Saving..." : "CLAIM PRIZES!"}
            </Button>
          </motion.div>

          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-gray-600 hover:text-gray-900 font-semibold py-2 transition-colors"
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
