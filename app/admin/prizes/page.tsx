"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const RARITY_TIERS = [
  { id: "common", label: "Commun (Très fréquent)", weight: 100, color: "bg-green-100 text-green-800" },
  { id: "uncommon", label: "Peu Commun (Fréquent)", weight: 50, color: "bg-blue-100 text-blue-800" },
  { id: "rare", label: "Rare (Difficile)", weight: 10, color: "bg-yellow-100 text-yellow-800" },
  { id: "legendary", label: "Légendaire (Très rare)", weight: 1, color: "bg-red-100 text-red-800" },
  { id: "custom", label: "Personnalisé (Avancé)", weight: 0, color: "bg-gray-100 text-gray-800" },
]

const getMatchingRarity = (wSimple: number, wPremium: number) => {
  const match = RARITY_TIERS.find(t => t.id !== 'custom' && t.weight === wSimple && t.weight === wPremium)
  return match ? match.id : 'custom'
}

export default function AdminPrizesPage() {
  const [prizes, setPrizes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", emoji: "", image_url: "", color: "#e63946", weight_simple: 100, weight_premium: 100, active: true })
  const [activeRarity, setActiveRarity] = useState("common")
  const [uploading, setUploading] = useState(false)

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

  const handleRarityChange = (r: string) => {
    setActiveRarity(r)
    const tier = RARITY_TIERS.find(t => t.id === r)
    if (tier && r !== "custom") {
      setForm(prev => ({ ...prev, weight_simple: tier.weight, weight_premium: tier.weight }))
    }
  }

  const handleCreateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", e.target.files[0])
      
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = await res.json()
      
      if (data.imageUrl) {
        setForm({ ...form, image_url: data.imageUrl, emoji: "" })
      } else {
        alert("Erreur d'upload: " + data.error)
      }
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const create = async () => {
    if (!form.name || (!form.emoji && !form.image_url)) return
    await fetch("/api/admin/prizes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setForm({ name: "", emoji: "", image_url: "", color: "#e63946", weight_simple: 100, weight_premium: 100, active: true })
    setActiveRarity("common")
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

  // Calculate totals for percentage display
  const totalSimple = prizes.filter(p => p.active).reduce((sum, p) => sum + (p.weight_simple || 0), 0)
  const totalPremium = prizes.filter(p => p.active).reduce((sum, p) => sum + (p.weight_premium || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Catalogue des Gains</h1>
        </div>

        {/* Weights Explanation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                <span className="text-2xl">📊</span> Comprendre les Probabilités
              </h3>
              <p className="text-blue-800 mt-2 leading-relaxed">
                Le système fonctionne comme une <strong>Roue de la Fortune</strong> géante. 
                Utilisez le sélecteur de <strong>Rareté</strong> pour régler les chances en un clic !
              </p>
              <div className="mt-4 bg-white/50 p-3 rounded-lg text-sm text-blue-900">
                <strong>💡 Astuce :</strong> Regardez la colonne <strong>% Chance</strong> dans le tableau ci-dessous. 
                Elle est calculée automatiquement en temps réel !
              </div>
            </div>
            
            <div className="flex-1 bg-white p-4 rounded-lg border border-blue-100 w-full">
              <h4 className="font-bold text-gray-700 text-xs uppercase mb-3">Exemple Visuel</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Cadeau Commun (Poids 100)</span>
                    <span className="font-bold">Très Fréquent</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[80%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Cadeau Rare (Poids 10)</span>
                    <span className="font-bold">Rare</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[20%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Jackpot (Poids 1)</span>
                    <span className="font-bold">Extrêmement Rare</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[5%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <label className="text-xs font-bold text-gray-500 uppercase">Visuel</label>
              <div className="flex items-center gap-2">
                {form.image_url ? (
                  <div className="relative w-10 h-10 group">
                    <img src={form.image_url} alt="Aperçu" className="w-full h-full object-cover rounded" />
                    <button 
                      onClick={() => setForm({ ...form, image_url: "" })}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="Emoji 🍕" className="w-full border rounded p-2 text-center" />
                )}
                <label className="cursor-pointer text-xs text-blue-600 hover:underline bg-gray-100 px-2 py-2 rounded flex-shrink-0">
                  {uploading ? "..." : "Upload IMG"}
                  <input type="file" className="hidden" accept="image/*" onChange={handleCreateUpload} disabled={uploading} />
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Couleur</label>
              <div className="flex items-center gap-2 border rounded p-2">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-6 h-6 rounded cursor-pointer" />
                <span className="text-xs text-gray-500">{form.color}</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Rareté</label>
              <select 
                value={activeRarity} 
                onChange={(e) => handleRarityChange(e.target.value)}
                className="w-full border rounded p-2 bg-white"
              >
                {RARITY_TIERS.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            {activeRarity === "custom" && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Poids (S)</label>
                  <input type="number" value={form.weight_simple} onChange={(e) => setForm({ ...form, weight_simple: Number(e.target.value) })} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Poids (P)</label>
                  <input type="number" value={form.weight_premium} onChange={(e) => setForm({ ...form, weight_premium: Number(e.target.value) })} className="w-full border rounded p-2" />
                </div>
              </>
            )}
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
                <PrizeRow 
                  key={p.id} 
                  prize={p} 
                  totalSimple={totalSimple} 
                  totalPremium={totalPremium} 
                  onUpdate={update} 
                  onDelete={remove} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PrizeRow({ prize, totalSimple, totalPremium, onUpdate, onDelete }: { 
  prize: any, 
  totalSimple: number, 
  totalPremium: number, 
  onUpdate: (id: string, patch: any) => Promise<void>, 
  onDelete: (id: string) => Promise<void> 
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...prize })
  const [uploading, setUploading] = useState(false)
  const [rowRarity, setRowRarity] = useState(getMatchingRarity(prize.weight_simple, prize.weight_premium))

  const handleRowRarityChange = (r: string) => {
    setRowRarity(r)
    const tier = RARITY_TIERS.find(t => t.id === r)
    if (tier && r !== "custom") {
      setEditForm((prev: any) => ({ ...prev, weight_simple: tier.weight, weight_premium: tier.weight }))
    }
  }

  const percentSimple = totalSimple > 0 ? ((prize.weight_simple / totalSimple) * 100).toFixed(1) : "0.0"
  const percentPremium = totalPremium > 0 ? ((prize.weight_premium / totalPremium) * 100).toFixed(1) : "0.0"

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", e.target.files[0])
      
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = await res.json()
      
      if (data.imageUrl) {
        setEditForm({ ...editForm, image_url: data.imageUrl, emoji: "" })
      } else {
        alert("Erreur d'upload: " + data.error)
      }
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    await onUpdate(prize.id, {
      name: editForm.name,
      emoji: editForm.emoji,
      image_url: editForm.image_url,
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
            <div className="flex flex-col gap-1 items-center">
               {editForm.image_url ? (
                  <div className="relative w-10 h-10 group">
                    <img src={editForm.image_url} alt="Aperçu" className="w-full h-full object-cover rounded" />
                    <button 
                      onClick={() => setEditForm({ ...editForm, image_url: "" })}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input value={editForm.emoji} onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })} className="w-10 border rounded p-1 text-center" />
                )}
                <label className="cursor-pointer text-[10px] text-blue-600 hover:underline">
                  {uploading ? "..." : "Changer IMG"}
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
            </div>
            <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border rounded p-1" />
          </div>
        </td>
        <td className="px-6 py-4 text-center" colSpan={2}>
           <select 
             value={rowRarity} 
             onChange={(e) => handleRowRarityChange(e.target.value)}
             className="w-full border rounded p-1 text-sm bg-white mb-1"
           >
             {RARITY_TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
           </select>
           
           {rowRarity === "custom" && (
             <div className="flex gap-1 justify-center mt-1">
               <input type="number" value={editForm.weight_simple} onChange={(e) => setEditForm({ ...editForm, weight_simple: e.target.value })} className="w-16 border rounded p-1 text-center text-xs" placeholder="S" />
               <input type="number" value={editForm.weight_premium} onChange={(e) => setEditForm({ ...editForm, weight_premium: e.target.value })} className="w-16 border rounded p-1 text-center text-xs" placeholder="P" />
             </div>
           )}
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
          {prize.image_url ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              <img src={prize.image_url} alt={prize.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <span className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">{prize.emoji}</span>
          )}
          <div>
            <div className="font-bold text-gray-900">{prize.name}</div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prize.color }} />
               <span className="text-xs text-gray-500">{prize.color}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono font-bold text-gray-700 text-lg">{prize.weight_simple}</span>
          {prize.active && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${Number(percentSimple) < 1 ? "bg-yellow-100 text-yellow-700" : "bg-blue-50 text-blue-600"}`}>
              {percentSimple}%
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono font-bold text-gray-700 text-lg">{prize.weight_premium}</span>
          {prize.active && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${Number(percentPremium) < 1 ? "bg-yellow-100 text-yellow-700" : "bg-purple-50 text-purple-600"}`}>
              {percentPremium}%
            </span>
          )}
        </div>
      </td>
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
