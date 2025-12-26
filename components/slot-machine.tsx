"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "./ui/button"
import { Prize } from "./prize-wheel"

interface SlotMachineProps {
  prizes: Prize[]
  ticketId: string
  onSpinComplete: (prize: Prize) => void
  spinsRemaining: number
}

const REEL_HEIGHT = 160 // Height of one visible item

function Reel({ 
  prizes, 
  isSpinning, 
  targetPrizeId, 
  delay = 0,
  onStop 
}: { 
  prizes: Prize[], 
  isSpinning: boolean, 
  targetPrizeId: string | null, 
  delay?: number,
  onStop?: () => void
}) {
  const controls = useAnimation()
  const [strip, setStrip] = useState<Prize[]>([])
  const [blurAmount, setBlurAmount] = useState(0)
  
  useEffect(() => {
    if (isSpinning && targetPrizeId) {
       // Construct a strip that ends with the target
       const base = []
       for(let i=0; i<30; i++) {
           base.push(prizes[Math.floor(Math.random() * prizes.length)])
       }
       // Ensure the target lands correctly
       const target = prizes.find(p => p.id === targetPrizeId) || prizes[0]
       
       // Target at index 25
       base[25] = target
       
       setStrip(base)
       
       const targetY = - (25 * REEL_HEIGHT)
       const duration = 2 + delay // Base spin + delay
       
       // Start blur
       setBlurAmount(4)
       
       controls.start({
           y: targetY,
           transition: {
               duration: duration,
               ease: [0.1, 0.9, 0.2, 1.0] // Ease out cubic/quart
           }
       }).then(() => {
           setBlurAmount(0)
           // Add a small "bounce" effect at the end
           controls.start({
             y: [targetY, targetY + 20, targetY],
             transition: { duration: 0.3, ease: "backOut" }
           }).then(() => {
             if (onStop) onStop()
           })
       })
       
    } else if (!isSpinning && !targetPrizeId) {
        // Initial state
        setStrip([...prizes, ...prizes, ...prizes])
        controls.set({ y: 0 })
        setBlurAmount(0)
    }
  }, [isSpinning, targetPrizeId, prizes, delay, controls, onStop])

  return (
    <div className="overflow-hidden h-[160px] w-[100px] md:w-[140px] bg-white border-x-4 border-black relative">
        {/* Shadow Overlay for Depth */}
        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_10px_20px_rgba(0,0,0,0.2),inset_0_-10px_20px_rgba(0,0,0,0.2)]"></div>
        
        {/* Highlight line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-red-500/30 z-20 pointer-events-none -translate-y-1/2"></div>

        <motion.div
            animate={controls}
            style={{ filter: `blur(${blurAmount}px)` }}
            className="flex flex-col items-center"
        >
            {strip.map((prize, i) => (
                <div key={i} className="h-[160px] w-full flex items-center justify-center p-2 border-b-2 border-zinc-100 box-border bg-white">
                    <div className="flex flex-col items-center justify-center w-full h-full transform scale-90">
                        {prize.image_url ? (
                             <img src={prize.image_url} alt={prize.name} className="h-28 w-28 object-contain mb-1 drop-shadow-md" />
                        ) : (
                             <span className="text-7xl filter drop-shadow-md">{prize.emoji}</span>
                        )}
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
  )
}

export function SlotMachine({ prizes, ticketId, onSpinComplete, spinsRemaining }: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [targetPrize, setTargetPrize] = useState<Prize | null>(null)
  const [reelsStopped, setReelsStopped] = useState(0)
  // We need to store the raw data for the callback
  const [spinResult, setSpinResult] = useState<any>(null)

  if (prizes.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center text-black font-black text-xl animate-pulse uppercase">
        Chargement des pizzas...
      </div>
    )
  }
  
  const handleReelStop = () => {
      setReelsStopped(prev => {
          const newState = prev + 1
          if (newState >= 3) {
              setTimeout(() => {
                  setIsSpinning(false)
              }, 500)
          }
          return newState
      })
  }

  const handleSpinWithData = async () => {
    if (isSpinning || spinsRemaining <= 0) return
    setIsSpinning(true)
    setReelsStopped(0)
    setTargetPrize(null)
    setSpinResult(null)

    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, spin_type: "simple" }),
      })

      if (!res.ok) throw new Error("Spin failed")
      const data = await res.json()
      setSpinResult(data)
      
      const wonPrize: Prize = {
          id: data.prize_id,
          name: data.prize_name,
          emoji: data.prize_emoji,
          image_url: data.prize_image,
          color: data.prize_color
      }
      setTargetPrize(wonPrize)
      
    } catch (e) {
        console.error(e)
        setIsSpinning(false)
    }
  }
  
  useEffect(() => {
      if (!isSpinning && reelsStopped >= 3 && spinResult) {
          const t = setTimeout(() => {
             onSpinComplete(spinResult)
          }, 1000)
          return () => clearTimeout(t)
      }
  }, [isSpinning, reelsStopped, spinResult, onSpinComplete])


  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#FFFDD0] px-2 py-8 font-sans relative overflow-x-hidden">
      
      {/* Background Ambience Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#FF007F 3px, transparent 3px)", backgroundSize: "40px 40px" }}></div>
      


      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col items-center justify-center w-full scale-[0.65] sm:scale-[0.8] md:scale-100 origin-center transition-transform duration-300">
            {/* Title */}
            <motion.div 
                className="text-center mb-6 relative z-10 shrink-0"
                initial={{ opacity: 0, y: -20, rotate: -2 }} 
                animate={{ opacity: 1, y: 0, rotate: -2 }}
            >
                <div className="inline-block bg-black text-white px-4 py-1 md:px-6 md:py-2 transform -rotate-2 mb-2 border-2 border-white shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                    <span className="font-bold tracking-widest uppercase text-xs md:text-base">LA ROUE DE LA FORTUNE</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-[#FF007F] mb-0 uppercase drop-shadow-[4px_4px_0_#000] md:drop-shadow-[6px_6px_0_#000] tracking-tighter leading-none stroke-black">
                    JACKPOT<br/><span className="text-black">PIZZA</span>
                </h1>
            </motion.div>

            {/* Slot Machine Body - Enhanced Cabinet */}
            <div className="relative z-10 bg-white p-2 rounded-xl border-[4px] md:border-[6px] border-black shadow-[10px_10px_0_rgba(0,0,0,0.8)] md:shadow-[20px_20px_0_rgba(0,0,0,0.8)] transform rotate-1 max-w-2xl w-full shrink-0">
                
                {/* Marquee Lights Top */}
                <div className="flex justify-between px-4 py-2 bg-black rounded-t-lg mb-2 border-b-4 border-black">
                    {[...Array(8)].map((_, i) => (
                    <motion.div 
                        key={i} 
                        className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-400 border-2 border-yellow-200"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                    ))}
                </div>

                <div className="bg-[#FF4500] p-3 md:p-8 rounded-lg border-4 border-black">
                    {/* Machine Header Decor */}
                    <div className="flex justify-between items-center mb-4 md:mb-6 bg-black p-2 md:p-3 border-4 border-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] transform -rotate-1">
                        <div className="flex gap-2 md:gap-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse delay-75"></div>
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse delay-150"></div>
                        </div>
                        <span className="text-white font-black text-lg md:text-xl uppercase tracking-widest drop-shadow-md">WIN BIG!</span>
                    </div>

                    {/* Reels Container */}
                    <div className="flex justify-center gap-1 md:gap-2 bg-zinc-900 p-2 md:p-4 border-4 border-black shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] rounded-md">
                        <Reel 
                        prizes={prizes} 
                        isSpinning={isSpinning} 
                        targetPrizeId={targetPrize?.id || null} 
                        delay={0}
                        onStop={handleReelStop}
                        />
                        <Reel 
                        prizes={prizes} 
                        isSpinning={isSpinning} 
                        targetPrizeId={targetPrize?.id || null} 
                        delay={0.4}
                        onStop={handleReelStop}
                        />
                        <Reel 
                        prizes={prizes} 
                        isSpinning={isSpinning} 
                        targetPrizeId={targetPrize?.id || null} 
                        delay={0.8}
                        onStop={handleReelStop}
                        />
                    </div>

                    {/* Controls Area */}
                    <div className="mt-4 md:mt-8 relative">
                        {/* Decorative Side Vents */}
                        <div className="absolute top-0 bottom-0 -left-6 w-4 hidden md:flex flex-col justify-between py-2">
                        {[...Array(4)].map((_,i) => <div key={i} className="h-2 w-full bg-black/20 rounded-full"></div>)}
                        </div>
                        <div className="absolute top-0 bottom-0 -right-6 w-4 hidden md:flex flex-col justify-between py-2">
                        {[...Array(4)].map((_,i) => <div key={i} className="h-2 w-full bg-black/20 rounded-full"></div>)}
                        </div>

                        <div className="flex justify-center">
                            <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full"
                            >
                                <Button
                                onClick={handleSpinWithData}
                                disabled={isSpinning || spinsRemaining <= 0}
                                className="w-full h-20 md:h-28 bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black text-3xl md:text-5xl font-black uppercase tracking-wider border-[4px] md:border-[6px] border-black shadow-[0_6px_0_#000] md:shadow-[0_10px_0_#000] active:translate-y-[6px] md:active:translate-y-[10px] active:shadow-none transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-[6px]"
                                >
                                {isSpinning ? (
                                    <span className="animate-pulse">...</span>
                                ) : (
                                    <span className="drop-shadow-sm">LANCER !</span>
                                )}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
                
                {/* Footer Text */}
                <div className="bg-black text-white p-2 md:p-3 mt-2 text-center border-t-4 border-black rounded-b-lg">
                    <p className="font-bold uppercase text-xs md:text-sm tracking-widest flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    {spinsRemaining > 0 ? "1 TOUR GRATUIT DISPO" : "REVIENS DEMAIN !"}
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
