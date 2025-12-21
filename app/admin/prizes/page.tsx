"use client"

import { useEffect, useState } from "react"

export default function AdminPrizesPage() {
  const [prizes, setPrizes] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", emoji: "", color: "", weight_simple: 0, weight_premium: 0, active: true })

  const load = async () => {
    const res = await fetch("/api/admin/prizes")
    const data = await res.json()
    setPrizes(data.prizes || [])
  }

  useEffect(() => {
    load()
  }, [])

  const create = async () => {
    await fetch("/api/admin/prizes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setForm({ name: "", emoji: "", color: "", weight_simple: 0, weight_premium: 0, active: true })
    await load()
  }

  const update = async (id: string, patch: any) => {
    await fetch(`/api/admin/prizes/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) })
    await load()
  }

  const remove = async (id: string) => {
    await fetch(`/api/admin/prizes/${id}`, { method: "DELETE" })
    await load()
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Prizes</h1>

      <div className="border rounded p-4 space-y-2">
        <div className="font-semibold">New Prize</div>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="border rounded p-2" />
          <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="Emoji" className="border rounded p-2" />
          <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Color" className="border rounded p-2" />
          <input type="number" value={form.weight_simple} onChange={(e) => setForm({ ...form, weight_simple: Number(e.target.value) })} placeholder="Weight Simple" className="border rounded p-2" />
          <input type="number" value={form.weight_premium} onChange={(e) => setForm({ ...form, weight_premium: Number(e.target.value) })} placeholder="Weight Premium" className="border rounded p-2" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        </div>
        <button onClick={create} className="px-4 py-2 bg-black text-white rounded">Create</button>
      </div>

      <div className="space-y-2">
        {prizes.map((p) => (
          <div key={p.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.emoji} {p.name}</div>
              <div className="text-sm text-gray-600">Simple: {p.weight_simple} Premium: {p.weight_premium} Active: {String(p.active)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => update(p.id, { active: !p.active })} className="px-3 py-1 border rounded">Toggle Active</button>
              <button onClick={() => remove(p.id)} className="px-3 py-1 border rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

