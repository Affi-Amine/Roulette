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
      className="fixed inset-0 bg-[#FFFDD0]/90 flex items-center justify-center p-4 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-8 max-w-sm w-full text-center shadow-[12px_12px_0_#000] border-4 border-black transform rotate-2"
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
          <div className="w-16 h-16 bg-[#FF4500] flex items-center justify-center border-4 border-black shadow-[4px_4px_0_#000]">
            <AlertTriangle className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Error Title */}
        <h2 className="text-3xl font-black text-black mb-3 uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">Déjà joué !</h2>

        {/* Error Message */}
        <p className="text-black mb-8 font-bold text-lg uppercase leading-tight">
          Tu as déjà tenté ta chance aujourd'hui. Reviens demain pour une nouvelle part de bonheur !
        </p>

        {/* Try Another Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onRetry}
            className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90 text-white font-black py-4 border-4 border-black shadow-[4px_4px_0_#000] uppercase rounded-none text-xl"
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
      className="fixed inset-0 bg-[#FFFDD0]/90 flex items-center justify-center p-4 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-8 max-w-sm w-full text-center shadow-[12px_12px_0_#000] border-4 border-black transform -rotate-1"
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
          <div className="w-16 h-16 bg-black flex items-center justify-center border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
            <AlertCircle className="w-8 h-8 text-[#FF007F]" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Error Title */}
        <h2 className="text-3xl font-black text-black mb-3 uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">Mamma Mia !</h2>

        {/* Error Message */}
        <p className="text-black mb-8 font-bold text-lg uppercase leading-tight">
          Une erreur est survenue. Rafraîchis la page et réessaie.
        </p>

        {/* Scan Again Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={onRetry} className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-black py-4 border-4 border-black shadow-[4px_4px_0_#000] uppercase rounded-none text-xl">
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
      className="min-h-screen bg-[#FFFDD0] flex items-center justify-center px-4 py-8 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-md text-center bg-white border-4 border-black p-8 shadow-[12px_12px_0_#000] transform rotate-1"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Icon */}
        <div className="text-7xl mb-6 filter drop-shadow-[4px_4px_0_#000]">😅</div>

        {/* Title */}
        <h1 className="text-3xl font-black text-[#FF007F] mb-4 uppercase drop-shadow-[2px_2px_0_#000]">PAS DE CHANCE !</h1>

        {/* Message */}
        <p className="text-black mb-8 text-lg font-bold uppercase leading-tight">
          C'est vide ! Réessaie avec un autre ticket de caisse !
        </p>

        {/* Tips */}
        <div className="bg-[#FFFDD0] border-4 border-black p-4 mb-8 space-y-3 text-left shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
          <p className="font-black text-black uppercase text-sm border-b-2 border-black border-dashed pb-2">Prochaines étapes :</p>
          <ul className="space-y-2 text-black font-bold uppercase text-xs">
            <li className="flex items-center gap-2">
              <span className="text-[#FF4500] text-xl">•</span>
              Mange plus de pizzas 🍕
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#FF4500] text-xl">•</span>
              Rends-toi en boutique 🏃
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#FF4500] text-xl">•</span>
              Gagne des cadeaux 🎁
            </li>
          </ul>
        </div>

        {/* Back Home Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onBackHome}
            className="w-full bg-black text-white font-black py-4 border-4 border-black hover:bg-zinc-800 transition-all uppercase rounded-none text-xl"
          >
            RETOUR À L'ACCUEIL
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
