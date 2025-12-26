"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"

export interface Prize {
  id: string
  name: string
  emoji: string
  image_url?: string | null
  color: string
}

interface PrizeWheelProps {
  prizes: Prize[]
  ticketId: string
  onSpinComplete: (prize: Prize) => void
  spinsRemaining: number
}

export function PrizeWheel({ prizes, ticketId, onSpinComplete, spinsRemaining }: PrizeWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const handleSpin = async () => {
    if (isSpinning || spinsRemaining <= 0) return

    setIsSpinning(true)

    try {
      // 1. Call API to get the result
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, spin_type: "simple" }),
      })

      if (!res.ok) {
        throw new Error("Spin failed")
      }

      const data = await res.json()
      const winningPrizeId = data.prize_id

      // 2. Find the winning segment index
      const winningIndex = prizes.findIndex((p) => p.id === winningPrizeId)
      if (winningIndex === -1) {
        throw new Error("Winning prize not found in local list")
      }

      // 3. Calculate rotation to land on the winner
      // The wheel spins clockwise.
      // 0 degrees is usually at 3 o'clock in SVG, but we have a pointer at top (270 deg or -90 deg).
      // Let's stick to the existing logic but reverse-engineer the target.
      
      // Existing logic:
      // const targetAngle = 360 * 5 + randomIndex * segmentAngle + segmentAngle / 2
      
      // If we want index i to be at the top:
      // The segment i is from (i * segmentAngle) to ((i+1) * segmentAngle).
      // The center of segment i is (i * segmentAngle + segmentAngle/2).
      // We want this center to align with the pointer.
      // If the pointer is at -90deg (top), and we rotate the wheel by R:
      // (CenterAngle + R) % 360 = -90 (or 270)
      // R = 270 - CenterAngle
      
      // Let's use a simpler approach:
      // Add extra full rotations (e.g. 5).
      // Calculate where the winning segment IS currently (at rotation 0).
      // Rotate back so it hits the pointer.
      
      const segmentAngle = 360 / prizes.length
      const winningSegmentCenter = winningIndex * segmentAngle + segmentAngle / 2
      
      // We want winningSegmentCenter to end up at 270 degrees (Top)
      // Current position + Rotation = 270
      // Rotation = 270 - winningSegmentCenter
      // Add 360 * 5 for effect.
      // Also, to handle negative results, we can add multiples of 360.
      
      // Let's try:
      // targetRotation = 360 * 5 + (270 - winningSegmentCenter)
      // Make sure it's positive and spins enough.
      
      // Actually, the previous code was:
      // const targetAngle = 360 * 5 + randomIndex * segmentAngle + segmentAngle / 2
      // This rotates the wheel BY targetAngle.
      // If we rotate BY (angle of index), that index moves AWAY from 0.
      // Wait, let's verify the SVG setup.
      // The pointer is at the TOP.
      // 0 degrees in SVG is 3 o'clock (Right).
      // Top is 270 degrees.
      
      // Let's just trust a standard formula:
      // To land on index i:
      // rotation = (360 * 5) - (i * segmentAngle) - (segmentAngle / 2) + 270
      // Let's verify:
      // If i=0 (0 to angle), center is angle/2.
      // We want angle/2 to be at 270.
      // Rot = 270 - angle/2. Correct.
      
      // We also add random jitter within the segment?
      // Maybe not for now, center is safer.
      
      let targetRotation = 360 * 5 + (270 - winningSegmentCenter)
      
      setRotation(targetRotation)

      // 4. Wait for animation
      setTimeout(() => {
        setIsSpinning(false)
        onSpinComplete(data) // Pass the full prize data from API or find it in list
      }, 4000)

    } catch (error) {
      console.error("Spin error:", error)
      setIsSpinning(false)
      // Handle error (maybe toast)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 px-4 py-8 font-sans relative overflow-hidden">
      {/* Ambient Background Glow - Warm Premium */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none mix-blend-overlay" />

      {/* Header */}
      <motion.div className="text-center mb-8 relative z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-amber-500 mb-2 uppercase drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] tracking-wide">Roulette Pizza</h1>
        <p className="text-zinc-400 font-medium tracking-widest uppercase text-sm">Tente ta chance</p>
      </motion.div>

      {/* Wheel Container */}
      <div className="relative w-80 h-80 mb-12 flex items-center justify-center z-10">
        {/* Pointer Triangle at Top */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-amber-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />

        {/* Wheel Border */}
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800 shadow-[0_0_60px_rgba(245,158,11,0.2)] bg-zinc-900" />

        {/* Wheel */}
        <motion.svg
          viewBox="0 0 280 280"
          className="relative z-10 w-full h-full p-2"
          animate={{ rotate: rotation }}
          transition={{
            duration: 4,
            ease: [0.23, 0.86, 0.39, 0.96],
          }}
          style={{ transformOrigin: "center" }}
        >
          {/* Segments */}
          {prizes.map((prize, index) => {
            const angle = (360 / prizes.length) * index
            const startAngle = angle
            const endAngle = angle + 360 / prizes.length

            return (
              <g key={prize.id}>
                {/* Segment */}
                <path
                  d={describeArc(140, 140, 120, startAngle, endAngle)}
                  fill={prize.color}
                  stroke="#18181b" // zinc-900
                  strokeWidth="2"
                />

                {/* Prize Content */}
                <g transform={`rotate(${startAngle + (360/prizes.length)/2 + 90} 140 140) translate(0, -85)`}>
                    <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="24"
                        fontWeight="bold"
                        transform="rotate(-90)" // Counter-rotate text if needed, or just adjust the group transform
                    >
                         {/* We want the text to point outwards or inwards? Usually inwards. 
                             The previous implementation rotated text. 
                             Let's stick to emoji/image for now.
                         */}
                         {prize.emoji}
                    </text>
                </g>
              </g>
            )
          })}

          {/* Center Circle */}
          <circle cx="140" cy="140" r="40" fill="#18181b" stroke="#d97706" strokeWidth="2" />
          <text
            x="140"
            y="140"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fbbf24"
            fontSize="24"
            fontWeight="bold"
          >
            🍕
          </text>
        </motion.svg>
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
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl py-6 px-12 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] border border-amber-400/20"
        >
          {isSpinning ? "..." : "FAIRE TOURNER"}
        </Button>
      </motion.div>

      {spinsRemaining === 0 && <p className="text-zinc-500 font-medium mt-6 text-sm uppercase tracking-wider">Plus de lancers disponibles</p>}
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
