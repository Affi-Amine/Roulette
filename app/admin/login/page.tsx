"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const supabaseClient = getSupabaseClient()
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      return
    }
    window.location.href = "/admin"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border rounded p-2"
        />
        <button type="submit" className="w-full bg-black text-white rounded p-2">
          Login
        </button>
      </form>
    </div>
  )
}
