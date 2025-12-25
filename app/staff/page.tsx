"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface UserPrize {
  id: string
  status: string
  created_at: string
  prize: {
    name: string
    emoji: string
    color: string
  }
}

interface User {
  id: string
  name: string
  email: string
  user_prizes: UserPrize[]
}

export default function StaffPage() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState<string | null>(null)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/staff/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setUsers(data.users || [])
    } finally {
      setLoading(false)
    }
  }

  const validatePrize = async (prizeId: string) => {
    setValidating(prizeId)
    try {
      await fetch(`/api/staff/validate-prize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prize_id: prizeId }),
      })
      await search()
    } finally {
      setValidating(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-[#e63946] uppercase tracking-tight">Tableau de Bord du Personnel 🍕</h1>
          <p className="text-gray-600 font-medium">Recherche client & Validation des gains</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Rechercher par Nom ou Email..."
              className="flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-xl text-lg outline-none transition-all placeholder:text-gray-400 font-medium"
            />
            <button 
              onClick={search} 
              disabled={loading}
              className="px-8 py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? "..." : "Rechercher"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {users.map((u) => (
            <motion.div 
              key={u.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{u.name}</h3>
                  <p className="text-gray-500 font-medium">{u.email}</p>
                </div>
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                  {u.user_prizes.length} Gains
                </span>
              </div>
              
              <div className="p-6 grid gap-4 md:grid-cols-2">
                {u.user_prizes.length === 0 ? (
                  <p className="text-gray-400 italic col-span-2 text-center py-4">Aucun gain trouvé</p>
                ) : (
                  u.user_prizes.map((p) => (
                    <div 
                      key={p.id} 
                      className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        p.status === "validated" 
                          ? "bg-gray-50 border-gray-100 opacity-75" 
                          : "bg-white border-[#f9c80e] shadow-[4px_4px_0_#f9c80e]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl bg-gray-100 w-12 h-12 flex items-center justify-center rounded-full">
                          {p.prize?.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{p.prize?.name}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            {new Date(p.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      {p.status === "validated" ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg border border-green-200 text-sm">
                          ✓ Validé
                        </span>
                      ) : (
                        <button
                          onClick={() => validatePrize(p.id)}
                          disabled={validating === p.id}
                          className="px-4 py-2 bg-[#2a9d8f] text-white font-bold rounded-lg shadow hover:bg-[#21867a] active:translate-y-1 transition-all text-sm uppercase"
                        >
                          {validating === p.id ? "..." : "Valider"}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
          
          {!loading && users.length === 0 && query && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl font-medium">Aucun résultat trouvé pour "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
