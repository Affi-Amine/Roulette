"use client"

import { useEffect, useState } from "react"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        if (!res.ok) {
          setError("Failed to load stats")
          return
        }
        const data = await res.json()
        setStats(data)
      } catch (e) {
        setError("Network error")
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-6">
        <a href="/admin/qr" className="underline">Generate QR Codes</a>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {stats ? (
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded p-4">
            <p className="font-semibold">Total Tickets</p>
            <p>{stats.totalTickets ?? 0}</p>
          </div>
          <div className="border rounded p-4">
            <p className="font-semibold">Total Prizes</p>
            <p>{stats.totalPrizes ?? 0}</p>
          </div>
          <div className="border rounded p-4">
            <p className="font-semibold">Total Users</p>
            <p>{stats.totalUsers ?? 0}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
