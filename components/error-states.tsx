"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { AlertCircle, AlertTriangle } from "lucide-react"

interface ErrorAlreadyUsedProps {
  onRetry: () => void
}

export function ErrorAlreadyUsed({ onRetry }: ErrorAlreadyUsedProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Warning Icon */}
        <motion.div
          className="mb-6 flex justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
        >
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ticket Already Used</h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-8">
          This ticket has already been scanned and used. Each ticket can only be used once.
        </p>

        {/* Try Another Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onRetry}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg"
          >
            TRY ANOTHER TICKET
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

interface ErrorInvalidQRProps {
  onRetry: () => void
}

export function ErrorInvalidQR({ onRetry }: ErrorInvalidQRProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Error Icon with Shake */}
        <motion.div
          className="mb-6 flex justify-center"
          animate={{ x: [-5, 5, -5, 5, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid QR Code</h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-8">
          This QR code is not recognized. Please scan the QR code on your pizza receipt.
        </p>

        {/* Scan Again Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={onRetry} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg">
            SCAN AGAIN
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

interface ErrorNoSpinsProps {
  onBackHome: () => void
}

export function ErrorNoSpins({ onBackHome }: ErrorNoSpinsProps) {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Icon */}
        <div className="text-6xl mb-6">😊</div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Better Luck Next Time!</h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 text-lg">
          You&#39;ve used all your spins for this ticket. Don&#39;t worry, you can try again with another pizza receipt!
        </p>

        {/* Tips */}
        <div className="bg-white rounded-xl p-6 mb-8 space-y-3 text-left">
          <p className="font-semibold text-gray-900">Next Steps:</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-orange-600">•</span>
              Buy more delicious pizzas
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-600">•</span>
              Get more ticket QR codes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-600">•</span>
              Win even more amazing prizes
            </li>
          </ul>
        </div>

        {/* Back Home Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onBackHome}
            className="w-full bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-bold py-6 rounded-xl shadow-lg"
          >
            BACK HOME
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
