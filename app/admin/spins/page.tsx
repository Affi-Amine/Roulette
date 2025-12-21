"use client"

import { useEffect, useState } from "react"

export default function AdminSpinsPage() {
  const [spins, setSpins] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/admin/spins")
      const data = await res.json()
      setSpins(data.spins || [])
    })()
  }, [])

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Spins</h1>
      <div className="space-y-2">
        {spins.map((s, i) => (
          <div key={i} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.prize?.emoji} {s.prize?.name}</div>
              <div className="text-sm text-gray-600">{new Date(s.created_at).toLocaleString()} — {s.spin_type} — Ticket {s.ticket_id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

