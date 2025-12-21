"use client"

import { useEffect, useState } from "react"

export default function AdminUsersPage() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])

  const load = async () => {
    const res = await fetch(`/api/staff/search?query=${encodeURIComponent(query)}`)
    const data = await res.json()
    setUsers(data.users || [])
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or phone" className="border rounded p-2 flex-1" />
        <button onClick={load} className="px-4 py-2 bg-black text-white rounded">Search</button>
      </div>
      <div className="space-y-4">
        {users.map((u) => (
          <div key={u.id} className="border rounded p-4">
            <div className="font-semibold">{u.name} — {u.phone}</div>
            <div className="mt-2 space-y-1 text-sm text-gray-700">Prizes: {(u.user_prizes || []).length}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

