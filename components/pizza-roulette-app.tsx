"use client"

import { useState } from "react"
import { LandingPage } from "./landing-page"
import { QRScanner } from "./qr-scanner"
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
  | "scanner"
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
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" })
  const [errorType, setErrorType] = useState<"used" | "invalid" | "no-spins" | null>(null)
  const [spinIds, setSpinIds] = useState<string[]>([])

  const handleScanSuccess = async (code: string) => {
    setCurrentState("verifying")
    try {
      let payload: any
      try {
        payload = JSON.parse(code)
      } catch {
        // Fallback: treat code as ticket id with zero spins
        setErrorType("invalid")
        setCurrentState("error-invalid")
        return
      }
      const res = await fetch("/api/verify-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) {
          setErrorType("used")
          setCurrentState("error-used")
        } else if (res.status === 400) {
          setErrorType("invalid")
          setCurrentState("error-invalid")
        }
        return
      }
      setTicketId(data.ticket_id)
      setSpinsRemaining((data.spins?.simple || 0) + (data.spins?.premium || 0))
      setCurrentState("wheel")
    } catch {
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

  const handleClaimPrize = (name: string, phone: string) => {
    setUserInfo({ name, phone })
    ;(async () => {
      const res = await fetch("/api/claim-prizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, name, phone, spin_ids: spinIds }),
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
    setUserInfo({ name: "", phone: "" })
    setErrorType(null)
    setSpinIds([])
  }

  const handleRetryScanner = () => {
    setCurrentState("scanner")
    setErrorType(null)
  }

  const handleErrorNoSpins = () => {
    handleBackToLanding()
  }

  return (
    <>
      {currentState === "landing" && <LandingPage onStartScan={() => setCurrentState("scanner")} />}

      {currentState === "scanner" && <QRScanner onScanSuccess={handleScanSuccess} onBack={handleBackToLanding} />}
      
      {currentState === "verifying" && (
        <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
          <div className="text-center">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
             <p className="text-xl">Verifying Ticket...</p>
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
          userPhone={userInfo.phone}
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
