"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugInfo("")
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) {
      setError("Erreur de configuration: NEXT_PUBLIC_SUPABASE_URL est manquant")
      return
    }

    try {
      const supabaseClient = getSupabaseClient()
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Identifiants incorrects")
        } else {
          setError("Erreur de connexion : " + error.message)
        }
        return
      }
      window.location.href = "/admin"
    } catch (err: any) {
      setError("Une erreur inattendue est survenue")
      setDebugInfo(err.message || JSON.stringify(err))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Connexion Admin</h1>
        {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          <p className="font-bold">{error}</p>
          {debugInfo && <p className="mt-1 text-xs font-mono">{debugInfo}</p>}
        </div>}
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
          placeholder="Mot de passe"
          className="w-full border rounded p-2"
        />
        <button type="submit" className="w-full bg-black text-white rounded p-2">
          Se connecter
        </button>
      </form>
    </div>
  )
}
