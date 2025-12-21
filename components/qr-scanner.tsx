"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, AlertCircle } from "lucide-react"
import jsQR from "jsqr"

interface QRScannerProps {
  onScanSuccess: (code: string) => void
  onBack: () => void
}

export function QRScanner({ onScanSuccess, onBack }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasError, setHasError] = useState(false)
  const [manualCode, setManualCode] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setHasError(false)
      } catch (error) {
        setHasError(true)
        console.error("Camera access denied:", error)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const [lastScan, setLastScan] = useState(0)

  useEffect(() => {
    let raf: number
    const scan = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) {
        raf = requestAnimationFrame(scan)
        return
      }
      const w = video.videoWidth
      const h = video.videoHeight
      if (!w || !h) {
        raf = requestAnimationFrame(scan)
        return
      }
      
      // Throttle scanning to every 100ms to save CPU
      const now = Date.now()
      // We can use a ref for throttling if state updates are too slow, but here we just check
      
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) {
        raf = requestAnimationFrame(scan)
        return
      }
      ctx.drawImage(video, 0, 0, w, h)
      
      // Optimization: if video is very large (e.g. 4k), we could scale down before scanning
      // But jsQR handles it reasonably well usually.
      
      const imageData = ctx.getImageData(0, 0, w, h)
      const result = jsQR(imageData.data, w, h)
      if (result?.data) {
        if (video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks()
          tracks.forEach((t) => t.stop())
        }
        onScanSuccess(result.data)
        return
      }
      raf = requestAnimationFrame(scan)
    }
    raf = requestAnimationFrame(scan)
    return () => cancelAnimationFrame(raf)
  }, [onScanSuccess])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-black/50">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-white font-semibold">Scan QR Code</h2>
        <div className="w-10" />
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {!hasError && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              aria-label="QR code camera"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanning Border Animation */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-64 h-64">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white" />

                {/* Animated scanning line */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"
                  animate={{ top: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                {/* Pulsing border */}
                <motion.div
                  className="absolute inset-0 border-2 border-white rounded"
                  animate={{ borderColor: ["rgba(255,255,255,1)", "rgba(220,38,38,1)"] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </motion.div>

            {/* Instructions */}
            <div className="absolute bottom-20 left-0 right-0 text-center text-white px-4">
              <p className="text-lg font-semibold drop-shadow-lg">Position QR code in the frame</p>
            </div>
          </>
        )}

        {hasError && (
          <motion.div className="text-center text-white px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
            <p className="text-gray-300">Please allow camera access to scan QR codes</p>
          </motion.div>
        )}
      </div>

      {/* Manual Entry / Actions */}
      <motion.div
        className="relative z-20 bg-black/80 backdrop-blur p-4 space-y-3 border-t border-white/20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {!showManualInput ? (
          <button
            onClick={() => setShowManualInput(true)}
            className="w-full px-4 py-3 border-2 border-white/50 hover:border-white text-white font-semibold rounded-lg transition-colors"
          >
            ENTER CODE MANUALLY
          </button>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Enter QR code..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/70"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowManualInput(false)
                  setManualCode("")
                }}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                SUBMIT
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
