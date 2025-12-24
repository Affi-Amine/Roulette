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
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-[8px_8px_0_rgba(0,0,0,1)] border-4 border-black"
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
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center border-4 border-black">
            <AlertTriangle className="w-8 h-8 text-black" />
          </div>
        </motion.div>

        {/* Error Title */}
        <h2 className="text-2xl font-black text-black mb-3 uppercase">Déjà joué !</h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-8 font-bold">
          Tu as déjà tenté ta chance aujourd'hui. Reviens demain pour une nouvelle part de bonheur !
        </p>

        {/* Try Another Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onRetry}
            className="w-full bg-primary hover:bg-red-700 text-white font-black py-3 rounded-lg border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase"
          >
            OK, À DEMAIN
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
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-[8px_8px_0_rgba(0,0,0,1)] border-4 border-black"
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
          <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center border-4 border-black">
            <AlertCircle className="w-8 h-8 text-black" />
          </div>
        </motion.div>

        {/* Error Title */}
        <h2 className="text-2xl font-black text-black mb-3 uppercase">Mamma Mia !</h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-8 font-bold">
          Une erreur est survenue. Rafraîchis la page et réessaie.
        </p>

        {/* Scan Again Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={onRetry} className="w-full bg-black text-white font-black py-3 rounded-lg border-2 border-white shadow-[4px_4px_0_rgba(255,255,255,0.5)] uppercase">
            RÉESSAYER
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
