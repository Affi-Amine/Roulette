"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        if (!res.ok) {
          setError("Échec du chargement des statistiques")
          return
        }
        const data = await res.json()
        setStats(data)
      } catch (e) {
        setError("Erreur réseau")
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase">Tableau de Bord</h1>
            <p className="text-gray-500 font-medium">Vue d'ensemble et gestion</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/qr" className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
              Générer QR Codes
            </Link>
          </div>
        </header>

        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Total Tickets Scannés" 
            value={stats?.totalTickets} 
            color="bg-blue-500"
            icon="🎟️"
          />
          <StatCard 
            label="Total Gains Distribués" 
            value={stats?.totalPrizes} 
            color="bg-[#e63946]"
            icon="🎁"
          />
          <StatCard 
            label="Utilisateurs Inscrits" 
            value={stats?.totalUsers} 
            color="bg-[#2a9d8f]"
            icon="👥"
          />
        </div>

        {/* Quick Actions / Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/users" className="group block p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">👥 Gérer les Utilisateurs</h3>
            <p className="text-gray-500">Voir la liste des participants, leurs tickets scannés et leurs gains.</p>
          </Link>

          <Link href="/admin/prizes" className="group block p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#e63946] transition-colors">🎁 Gérer les Gains</h3>
            <p className="text-gray-500">Ajouter des gains, modifier les probabilités et activer/désactiver des lots.</p>
          </Link>
          
          <Link href="/admin/spins" className="group block p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">🎰 Historique des Spins</h3>
            <p className="text-gray-500">Voir le journal complet des tirages effectués par les utilisateurs.</p>
          </Link>

          <Link href="/admin/wins" className="group block p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">🏆 Historique des Gains</h3>
            <p className="text-gray-500">Voir la liste de tous les lots remportés et valider les gains.</p>
          </Link>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }: { label: string, value: number | undefined, color: string, icon: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
      <div>
        <p className="text-gray-500 font-medium text-sm uppercase tracking-wide mb-1">{label}</p>
        <p className="text-4xl font-black text-gray-900">{value ?? "-"}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color} bg-opacity-10`}>
        {icon}
      </div>
    </div>
  )
}
