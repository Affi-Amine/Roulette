"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, CheckCircle, Clock, ArrowLeft, Gift, Calendar, User } from "lucide-react"

export default function AdminWinsPage() {
  const [wins, setWins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [validating, setValidating] = useState<string | null>(null)

  const fetchWins = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (search) params.append("search", search)
      
      const res = await fetch(`/api/admin/wins?${params.toString()}`)
      const data = await res.json()
      setWins(data.wins || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWins()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, statusFilter])

  const validateWin = async (id: string) => {
    if (!confirm("Valider ce gain ? Cette action est irréversible.")) return
    
    setValidating(id)
    try {
      await fetch(`/api/admin/wins/${id}`, { method: "PUT" })
      await fetchWins()
    } catch (e) {
      alert("Erreur lors de la validation")
    } finally {
      setValidating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const isValidated = status === 'validated' || status === 'Validé'
    return {
      label: isValidated ? 'Validé' : 'Obtenu',
      className: isValidated 
        ? 'bg-green-100 text-green-700 border-green-200' 
        : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: isValidated ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <Link href="/admin" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Historique des Gains</h1>
            <p className="text-gray-500 font-medium">Liste de tous les gains attribués et leur statut.</p>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="obtained">Obtenu (Non utilisé)</option>
              <option value="validated">Validé (Utilisé)</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400 animate-pulse">Chargement des gains...</div>
          ) : wins.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
              Aucun gain trouvé pour cette recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {wins.map((win) => {
                const badge = getStatusBadge(win.status)
                return (
                  <div key={win.id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-gray-300 transition-all">
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-2xl flex-shrink-0">
                        {win.prize.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{win.prize.name}</h3>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="font-medium text-gray-700">{win.user.name}</span>
                          </div>
                          <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(win.wonAt).toLocaleDateString()} à {new Date(win.wonAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${badge.className}`}>
                        {badge.icon}
                        {badge.label}
                      </div>

                      {badge.label === 'Obtenu' && (
                        <button
                          onClick={() => validateWin(win.id)}
                          disabled={validating === win.id}
                          className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {validating === win.id ? "Validation..." : "Valider"}
                        </button>
                      )}
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
