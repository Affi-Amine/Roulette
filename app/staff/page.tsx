"use client"

import { useEffect, useState } from "react"

export default function StaffPage() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    setLoading(true)
    const res = await fetch(`/api/staff/search?query=${encodeURIComponent(query)}`)
    const data = await res.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  useEffect(() => {
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validatePrize = async (id: string) => {
    await fetch(`/api/staff/validate-prize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prize_id: id }),
    })
    await search()
  }

  return (
    <div className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">Staff Search</h1>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par Nom ou Email"
          className="border-2 border-black rounded-lg p-2 flex-1 font-sans"
        />
        <button onClick={search} className="px-4 py-2 bg-accent text-black font-bold border-2 border-black rounded-lg shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0_rgba(0,0,0,1)] uppercase">Rechercher</button>
      </div>
      {loading ? <p className="font-bold animate-pulse">Chargement...</p> : null}
      <div className="space-y-4">
        {users.map((u) => (
          <div key={u.id} className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
            <div className="font-black text-lg uppercase mb-2">{u.name}</div>
            <div className="text-sm text-gray-600 mb-4 font-bold">{u.email}</div>
            <div className="mt-2 space-y-2">
              {(u.user_prizes || []).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between bg-muted p-2 rounded-lg border border-black/10">
                  <div>
                    <span className="mr-2 text-xl">{p.prize?.emoji}</span>
                    <span className="font-bold">{p.prize?.name}</span>
                    <div className="text-xs font-bold uppercase mt-1">
                      Status: <span className={p.status === "validated" ? "text-green-600" : "text-orange-500"}>{p.status === "validated" ? "Validé" : "En attente"}</span>
                    </div>
                  </div>
                  {p.status !== "validated" && (
                    <button onClick={() => validatePrize(p.id)} className="px-3 py-1 bg-green-500 text-white font-bold rounded border-2 border-green-700 shadow-sm hover:bg-green-600 uppercase text-xs">
                      Valider
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

