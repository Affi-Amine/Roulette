"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Check } from "lucide-react"

interface SuccessConfirmationProps {
  userName: string
  userPhone: string
  prize: {
    id: string
    name: string
    emoji: string
  }
  onComplete: () => void
}

export function SuccessConfirmation({ userName, userPhone, prize, onComplete }: SuccessConfirmationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md text-center"
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
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-green-500"
              />
              <Check className="w-12 h-12 text-green-600 font-bold" />
            </div>
          </div>
        </motion.div>

        {/* Success Title */}
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Prizes Saved!
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your reward has been securely saved to your account.
        </motion.p>

        {/* Confirmation Details Card */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Prize Won */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Prize Won:</span>
            <span className="text-lg font-bold text-gray-900">
              {prize.emoji} {prize.name}
            </span>
          </div>

          {/* Name */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="font-semibold text-gray-900">{userName}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Phone:</span>
            <span className="font-semibold text-gray-900">{userPhone}</span>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-blue-900 font-semibold">Show this screen to staff to claim your rewards!</p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg"
          >
            DONE!
          </Button>
        </motion.div>

        {/* Footer Text */}
        <p className="text-sm text-gray-500 mt-6">Your prize information has been saved and confirmed.</p>
      </motion.div>
    </div>
  )
}
