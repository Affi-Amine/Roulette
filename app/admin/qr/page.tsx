"use client"

import { useState } from "react"

export default function AdminQRPage() {
  const [ticketId, setTicketId] = useState("TEST-001")
  const [classiques, setClassiques] = useState(2)
  const [premium, setPremium] = useState(1)
  const [qrUrl, setQrUrl] = useState<string>("")
  const [payload, setPayload] = useState<any>(null)
  const [error, setError] = useState("")

  const generate = async () => {
    setError("")
    setQrUrl("")
    setPayload(null)
    try {
      const res = await fetch("/api/admin/dev/generate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, nb_pizzas_classiques: classiques, nb_pizzas_premium: premium }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to generate ticket")
        return
      }
      setPayload(data.payload)
      const url = `/api/admin/dev/qr?ticket_id=${encodeURIComponent(ticketId)}&nb_pizzas_classiques=${classiques}&nb_pizzas_premium=${premium}`
      setQrUrl(url)
    } catch (e: any) {
      setError("Network error")
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">Generate QR Codes</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm">Ticket ID</label>
          <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Pizzas Classiques</label>
          <input type="number" value={classiques} onChange={(e) => setClassiques(Number(e.target.value))} className="w-full border rounded p-2" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Pizzas Premium</label>
          <input type="number" value={premium} onChange={(e) => setPremium(Number(e.target.value))} className="w-full border rounded p-2" />
        </div>
      </div>
      <button onClick={generate} className="px-4 py-2 bg-black text-white rounded">Generate</button>

      {payload && (
        <div className="border rounded p-4">
          <div className="font-semibold mb-2">Payload</div>
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">{JSON.stringify(payload, null, 2)}</pre>
        </div>
      )}

      {qrUrl && (
        <div className="space-y-2">
          <div className="font-semibold">QR Image</div>
          <img src={qrUrl} alt="QR Code" className="w-60 h-60 border rounded" />
          <div className="text-sm">
            Image URL: <a href={qrUrl} target="_blank" rel="noreferrer" className="underline">{qrUrl}</a>
          </div>
        </div>
      )}
    </div>
  )
}

