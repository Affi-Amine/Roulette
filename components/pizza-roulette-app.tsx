"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "./landing-page"
// import { PrizeWheel, Prize } from "./prize-wheel" // Deprecated
import { SlotMachine } from "./slot-machine"
import { Prize } from "./prize-wheel" // Keeping type import for now
import { PrizeResults } from "./prize-results"
import { SuccessConfirmation } from "./success-confirmation"
import { ErrorAlreadyUsed, ErrorInvalidQR, ErrorNoSpins } from "./error-states"
import { supabaseClient } from "@/lib/supabase"

type AppState =
  | "landing"
  | "verifying"
  | "wheel"
  | "results"
  | "success"
  | "error-used"
  | "error-invalid"
  | "error-no-spins"

const SPINS_PER_TICKET = 1

export function PizzaRouletteApp() {
  const [currentState, setCurrentState] = useState<AppState>("landing")
  const [ticketId, setTicketId] = useState<string>("")
  const [spinsRemaining, setSpinsRemaining] = useState(SPINS_PER_TICKET)
  const [wonPrizes, setWonPrizes] = useState<Prize[]>([])
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null)
  const [userInfo, setUserInfo] = useState({ name: "", email: "" })
  const [errorType, setErrorType] = useState<"used" | "invalid" | "no-spins" | "daily-limit" | null>(null)
  const [spinIds, setSpinIds] = useState<string[]>([])
  const [prizes, setPrizes] = useState<Prize[]>([])

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabaseClient
        .from("prizes")
        .select("*")
        .eq("active", true)
        .order("name")
      
      if (error) {
        console.error("Error fetching prizes:", error)
        return
      }

      if (data) {
        setPrizes(data.map(p => ({
          id: p.id,
          name: p.name,
          emoji: p.emoji,
          image_url: p.image_url,
          color: p.color
        })))
      }
    }

    fetchPrizes()
  }, [])

  const handleStartScan = async () => {
    // Check daily limit
    const lastSpinDate = localStorage.getItem("lastSpinDate")
    const today = new Date().toDateString()
    
    if (lastSpinDate === today) {
      setErrorType("daily-limit")
      setCurrentState("error-used")
      return
    }

    setCurrentState("verifying")

    try {
      const res = await fetch("/api/public-session", {
        method: "POST",
      })
      
      if (!res.ok) {
        if (res.status === 429) {
          setErrorType("daily-limit") // Or rate-limit
          setCurrentState("error-used")
        } else {
          // Generic error
          setErrorType("invalid")
          setCurrentState("error-invalid")
        }
        return
      }

      const data = await res.json()
      setTicketId(data.ticket_id)
      setSpinsRemaining(1)
      setCurrentState("wheel")
      
      // Set cookie/local storage
      localStorage.setItem("lastSpinDate", today)

    } catch (error) {
      console.error("Error starting session:", error)
      setErrorType("invalid")
      setCurrentState("error-invalid")
    }
  }

  const handleSpinComplete = async (spinResult: any) => {
    // spinResult comes from PrizeWheel which got it from /api/spin
    const prize: Prize = {
      id: spinResult.prize_id,
      name: spinResult.prize_name,
      emoji: spinResult.prize_emoji,
      image_url: spinResult.prize_image,
      color: spinResult.prize_color,
    }
    
    setSpinIds((ids) => [...ids, spinResult.spin_id])
    setCurrentPrize(prize)
    setWonPrizes((prev) => [...prev, prize])
    setSpinsRemaining((prev) => Math.max(prev - 1, 0))
    setCurrentState("results")
  }

  const handleClaimPrize = (name: string, email: string) => {
    setUserInfo({ name, email })
    ;(async () => {
      const res = await fetch("/api/claim-prizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, name, email, spin_ids: spinIds }),
      })
      if (res.ok) setCurrentState("success")
    })()
  }

  const handleBackToLanding = () => {
    setCurrentState("landing")
    setTicketId("")
    setSpinsRemaining(SPINS_PER_TICKET)
    setWonPrizes([])
    setCurrentPrize(null)
    setUserInfo({ name: "", email: "" })
    setErrorType(null)
    setSpinIds([])
  }

  const handleRetryScanner = () => {
    setCurrentState("landing")
    setErrorType(null)
  }

  const handleErrorNoSpins = () => {
    handleBackToLanding()
  }

  return (
    <>
      {currentState === "landing" && <LandingPage onStartScan={handleStartScan} />}
      
      {currentState === "verifying" && (
        <div className="fixed inset-0 bg-[#FFFDD0] flex items-center justify-center text-black font-sans z-50">
          <div className="text-center">
             <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-b-8 border-[#FF007F] border-r-8 border-r-transparent border-l-8 border-l-transparent mx-auto mb-6"></div>
             <p className="text-2xl font-black uppercase tracking-widest animate-pulse">Vérification...</p>
          </div>
        </div>
      )}

      {currentState === "wheel" && currentPrize === null && (
        <SlotMachine 
          prizes={prizes}
          ticketId={ticketId}
          onSpinComplete={handleSpinComplete} 
          spinsRemaining={spinsRemaining} 
        />
      )}

      {currentState === "results" && currentPrize && (
        <PrizeResults
          prize={currentPrize}
          onClaim={handleClaimPrize}
          onBack={() => {
            if (spinsRemaining > 0) {
              setCurrentState("wheel")
              setCurrentPrize(null)
            } else {
              setCurrentState("error-no-spins")
            }
          }}
        />
      )}

      {currentState === "success" && currentPrize && (
        <SuccessConfirmation
          userName={userInfo.name}
          userEmail={userInfo.email}
          prize={currentPrize}
          onComplete={handleBackToLanding}
        />
      )}

      {currentState === "error-used" && <ErrorAlreadyUsed onRetry={handleRetryScanner} />}

      {currentState === "error-invalid" && <ErrorInvalidQR onRetry={handleRetryScanner} />}

      {currentState === "error-no-spins" && <ErrorNoSpins onBackHome={handleErrorNoSpins} />}
    </>
  )
}
