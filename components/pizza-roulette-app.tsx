"use client"

import { useState } from "react"
import { LandingPage } from "./landing-page"
import { PrizeWheel } from "./prize-wheel"
import { PrizeResults } from "./prize-results"
import { SuccessConfirmation } from "./success-confirmation"
import { ErrorAlreadyUsed, ErrorInvalidQR, ErrorNoSpins } from "./error-states"

interface Prize {
  id: string
  name: string
  emoji: string
  color: string
}

type AppState =
  | "landing"
  | "verifying"
  | "wheel"
  | "results"
  | "success"
  | "error-used"
  | "error-invalid"
  | "error-no-spins"

const SPINS_PER_TICKET = 3

export function PizzaRouletteApp() {
  const [currentState, setCurrentState] = useState<AppState>("landing")
  const [ticketId, setTicketId] = useState<string>("")
  const [spinsRemaining, setSpinsRemaining] = useState(SPINS_PER_TICKET)
  const [wonPrizes, setWonPrizes] = useState<Prize[]>([])
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null)
  const [userInfo, setUserInfo] = useState({ name: "", email: "" })
  const [errorType, setErrorType] = useState<"used" | "invalid" | "no-spins" | "daily-limit" | null>(null)
  const [spinIds, setSpinIds] = useState<string[]>([])

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

  const handleSpinComplete = async (_prize: Prize) => {
    if (!ticketId) return
    const spinType = "simple" // Frontend wheel does not differentiate; backend weights handle types; adjust if needed
    const res = await fetch("/api/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id: ticketId, spin_type: spinType }),
    })
    const data = await res.json()
    if (!res.ok) {
      if (res.status === 400 && data.error_code === "no_spins") {
        setCurrentState("error-no-spins")
      }
      return
    }
    const prize: Prize = {
      id: data.prize_id,
      name: data.prize_name,
      emoji: data.prize_emoji,
      color: data.prize_color,
    }
    setSpinIds((ids) => [...ids, data.spin_id])
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
        <div className="fixed inset-0 bg-[#fffcf5] flex items-center justify-center text-black">
          <div className="text-center">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#e63946] mx-auto mb-4"></div>
             <p className="text-xl font-bold">Vérification en cours...</p>
          </div>
        </div>
      )}

      {currentState === "wheel" && currentPrize === null && (
        <PrizeWheel onSpinComplete={handleSpinComplete} spinsRemaining={spinsRemaining} />
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
