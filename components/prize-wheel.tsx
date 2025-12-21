"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"

interface Prize {
  id: string
  name: string
  emoji: string
  color: string
}

interface PrizeWheelProps {
  onSpinComplete: (prize: Prize) => void
  spinsRemaining: number
}

const PRIZES: Prize[] = [
  { id: "1", name: "Free Medium Pizza", emoji: "🍕", color: "#E63946" },
  { id: "2", name: "Free Large Pizza", emoji: "🍕", color: "#F77F00" },
  { id: "3", name: "20% Off Next Order", emoji: "🎟️", color: "#FCBF49" },
  { id: "4", name: "Free Sides", emoji: "🍟", color: "#06A77D" },
  { id: "5", name: "Free Dessert", emoji: "🍰", color: "#E63946" },
  { id: "6", name: "Free Drink", emoji: "🥤", color: "#F77F00" },
  { id: "7", name: "Free Sauce Pack", emoji: "🧂", color: "#FCBF49" },
  { id: "8", name: "Double Points", emoji: "⭐", color: "#06A77D" },
]

export function PrizeWheel({ onSpinComplete, spinsRemaining }: PrizeWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const handleSpin = () => {
    if (isSpinning || spinsRemaining <= 0) return

    setIsSpinning(true)

    // Calculate random spin: 5 full rotations + random angle
    const randomIndex = Math.floor(Math.random() * PRIZES.length)
    const segmentAngle = 360 / PRIZES.length
    const targetAngle = 360 * 5 + randomIndex * segmentAngle + segmentAngle / 2

    setRotation(targetAngle)

    // Complete spin after animation
    setTimeout(() => {
      setIsSpinning(false)
      onSpinComplete(PRIZES[randomIndex])
    }, 4000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 px-4 py-8">
      {/* Header */}
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">You Have {spinsRemaining} Spins! 🎉</h1>
        <p className="text-gray-600">Spin the wheel to win amazing prizes</p>
      </motion.div>

      {/* Wheel Container */}
      <div className="relative w-72 h-72 mb-8 flex items-center justify-center">
        {/* Pointer Triangle at Top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg" />

        {/* Wheel */}
        <motion.svg
          viewBox="0 0 280 280"
          className="w-full h-full"
          animate={{ rotate: rotation }}
          transition={{
            duration: 4,
            ease: [0.23, 0.86, 0.39, 0.96],
          }}
          style={{ transformOrigin: "center" }}
        >
          {/* Segments */}
          {PRIZES.map((prize, index) => {
            const angle = (360 / PRIZES.length) * index
            const startAngle = angle
            const endAngle = angle + 360 / PRIZES.length

            return (
              <g key={prize.id}>
                {/* Segment */}
                <path
                  d={describeArc(140, 140, 120, startAngle, endAngle)}
                  fill={prize.color}
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Prize Text */}
                <text
                  x="140"
                  y="140"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  transform={`rotate(${startAngle + 45} 140 140)`}
                  className="pointer-events-none"
                >
                  <tspan x="140" dy="-25">
                    {prize.emoji}
                  </tspan>
                </text>
              </g>
            )
          })}

          {/* Center Circle */}
          <circle cx="140" cy="140" r="50" fill="white" stroke="#E63946" strokeWidth="3" />
          <circle cx="140" cy="140" r="40" fill="#E63946" />
          <text
            x="140"
            y="140"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="28"
            fontWeight="bold"
          >
            🎰
          </text>
        </motion.svg>
      </div>

      {/* Spins Counter */}
      <div className="flex gap-2 mb-8 justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-4 h-4 rounded-full ${i < spinsRemaining ? "bg-red-600" : "bg-gray-300"}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Spin Button */}
      <motion.div
        whileHover={!isSpinning && spinsRemaining > 0 ? { scale: 1.05 } : {}}
        whileTap={!isSpinning && spinsRemaining > 0 ? { scale: 0.95 } : {}}
      >
        <Button
          size="lg"
          onClick={handleSpin}
          disabled={isSpinning || spinsRemaining <= 0}
          className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl py-6 px-8 rounded-xl shadow-lg"
        >
          {isSpinning ? "SPINNING..." : "🎰 SPIN NOW!"}
        </Button>
      </motion.div>

      {spinsRemaining === 0 && <p className="text-orange-600 font-semibold mt-4">No spins remaining</p>}
    </div>
  )
}

// Helper function to calculate SVG arc path
function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1"

  return ["M", cx, cy, "L", start.x, start.y, "A", radius, radius, 0, largeArc, 0, end.x, end.y, "Z"].join(" ")
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}
