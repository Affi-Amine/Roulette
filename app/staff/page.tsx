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
          placeholder="Search name or phone"
          className="border rounded p-2 flex-1"
        />
        <button onClick={search} className="px-4 py-2 bg-black text-white rounded">Search</button>
      </div>
      {loading ? <p>Loading...</p> : null}
      <div className="space-y-4">
        {users.map((u) => (
          <div key={u.id} className="border rounded p-4">
            <div className="font-semibold">{u.name} — {u.phone}</div>
            <div className="mt-2 space-y-2">
              {(u.user_prizes || []).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <span className="mr-2">{p.prize?.emoji} {p.prize?.name}</span>
                    <span className="text-sm text-gray-600">{p.status}</span>
                  </div>
                  {p.status !== "validated" && (
                    <button onClick={() => validatePrize(p.id)} className="px-3 py-1 border rounded">
                      Validate
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

