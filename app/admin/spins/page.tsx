"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Ticket, User, Calendar, Dna } from "lucide-react"

export default function AdminSpinsPage() {
  const [spins, setSpins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/spins")
      const data = await res.json()
      setSpins(data.spins || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <Link href="/admin" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au Tableau de Bord
            </Link>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Historique des Lancers</h1>
            <p className="text-gray-500 font-medium">Journal des 100 derniers tirages effectués.</p>
          </div>
          <button 
            onClick={load}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </header>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400 animate-pulse">Chargement de l'historique...</div>
          ) : spins.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
              Aucun tirage trouvé.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {spins.map((spin) => (
                <div key={spin.id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-gray-300 transition-all">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                      {spin.prize?.emoji || '🎰'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{spin.prize?.name || 'Inconnu'}</h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="font-medium text-gray-700">
                            {spin.ticket?.user?.name || 'Utilisateur Anonyme'}
                          </span>
                        </div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          <span className="font-mono text-xs">{spin.ticket_id.split('-')[0]}...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        spin.spin_type === 'premium' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {spin.spin_type === 'simple' ? 'Classique' : spin.spin_type === 'premium' ? 'Premium' : spin.spin_type}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 font-medium whitespace-nowrap">
                      {new Date(spin.created_at).toLocaleString('fr-FR')}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
