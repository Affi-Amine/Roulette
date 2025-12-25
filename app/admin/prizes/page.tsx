"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function AdminPrizesPage() {
  const [prizes, setPrizes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", emoji: "", color: "#e63946", weight_simple: 10, weight_premium: 10, active: true })

  const load = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/prizes")
    const data = await res.json()
    setPrizes(data.prizes || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const create = async () => {
    if (!form.name || !form.emoji) return
    await fetch("/api/admin/prizes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setForm({ name: "", emoji: "", color: "#e63946", weight_simple: 10, weight_premium: 10, active: true })
    await load()
  }

  const update = async (id: string, patch: any) => {
    await fetch(`/api/admin/prizes/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) })
    await load()
  }

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce gain ?")) return
    await fetch(`/api/admin/prizes/${id}`, { method: "DELETE" })
    await load()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Catalogue des Gains</h1>
        </div>

        {/* Create Form */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="font-bold text-lg">Ajouter un nouveau gain</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Nom</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Pizza Reine" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Emoji</label>
              <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="🍕" className="w-full border rounded p-2 text-center" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Couleur</label>
              <div className="flex items-center gap-2 border rounded p-2">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-6 h-6 rounded cursor-pointer" />
                <span className="text-xs text-gray-500">{form.color}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Poids (Simple)</label>
              <input type="number" value={form.weight_simple} onChange={(e) => setForm({ ...form, weight_simple: Number(e.target.value) })} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Poids (Premium)</label>
              <input type="number" value={form.weight_premium} onChange={(e) => setForm({ ...form, weight_premium: Number(e.target.value) })} className="w-full border rounded p-2" />
            </div>
          </div>
          <button onClick={create} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">
            Ajouter le gain
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Gain</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">Poids Simple</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">Poids Premium</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">Statut</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {prizes.map((p) => (
                <PrizeRow key={p.id} prize={p} onUpdate={update} onDelete={remove} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PrizeRow({ prize, onUpdate, onDelete }: { prize: any, onUpdate: (id: string, patch: any) => Promise<void>, onDelete: (id: string) => Promise<void> }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...prize })

  const handleSave = async () => {
    await onUpdate(prize.id, {
      name: editForm.name,
      emoji: editForm.emoji,
      weight_simple: Number(editForm.weight_simple),
      weight_premium: Number(editForm.weight_premium),
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <tr className="bg-blue-50/50">
        <td className="px-6 py-4">
          <div className="flex gap-2 items-center">
            <input value={editForm.emoji} onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })} className="w-10 border rounded p-1 text-center" />
            <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border rounded p-1" />
          </div>
        </td>
        <td className="px-6 py-4 text-center">
          <input type="number" value={editForm.weight_simple} onChange={(e) => setEditForm({ ...editForm, weight_simple: e.target.value })} className="w-16 border rounded p-1 text-center mx-auto" />
        </td>
        <td className="px-6 py-4 text-center">
          <input type="number" value={editForm.weight_premium} onChange={(e) => setEditForm({ ...editForm, weight_premium: e.target.value })} className="w-16 border rounded p-1 text-center mx-auto" />
        </td>
        <td className="px-6 py-4 text-center">
          -
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            <button onClick={handleSave} className="text-green-600 font-bold hover:underline">Sauver</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:underline">Annuler</button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${!prize.active ? "opacity-50 grayscale" : ""}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">{prize.emoji}</span>
          <div>
            <div className="font-bold text-gray-900">{prize.name}</div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prize.color }} />
               <span className="text-xs text-gray-500">{prize.color}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center font-mono text-gray-600">{prize.weight_simple}</td>
      <td className="px-6 py-4 text-center font-mono text-gray-600">{prize.weight_premium}</td>
      <td className="px-6 py-4 text-center">
        <button 
          onClick={() => onUpdate(prize.id, { active: !prize.active })}
          className={`px-3 py-1 rounded-full text-xs font-bold border ${prize.active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
        >
          {prize.active ? "Actif" : "Inactif"}
        </button>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Modifier</button>
          <button onClick={() => onDelete(prize.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Supprimer</button>
        </div>
      </td>
    </tr>
  )
}
