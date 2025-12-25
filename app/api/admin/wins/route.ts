import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const supabase = supabaseServer()

  // Parse query params for filtering
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") // "Obtenu" or "Validé"
  const search = searchParams.get("search") // Name or email

  let query = supabase
    .from("user_prizes")
    .select(`
      id,
      status,
      created_at,
      validated_at,
      users (
        id,
        name,
        email
      ),
      prizes (
        id,
        name,
        emoji,
        color
      )
    `)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  // Note: Supabase doesn't support deep filtering on joined tables easily with simple query builder
  // We will fetch more and filter in memory if search is present, or use a custom RPC if needed.
  // For now, let's fetch and if search is present, we filter in JS (assuming reasonable dataset size).
  
  const { data: wins, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let filteredWins = wins

  if (search) {
    const lowerSearch = search.toLowerCase()
    filteredWins = wins.filter((win: any) => {
      const userName = win.users?.name?.toLowerCase() || ""
      const userEmail = win.users?.email?.toLowerCase() || ""
      return userName.includes(lowerSearch) || userEmail.includes(lowerSearch)
    })
  }

  const formattedWins = filteredWins.map((win: any) => ({
    id: win.id,
    user: {
      id: win.users?.id,
      name: win.users?.name,
      email: win.users?.email,
    },
    prize: {
      id: win.prizes?.id,
      name: win.prizes?.name,
      emoji: win.prizes?.emoji,
      color: win.prizes?.color,
    },
    status: win.status,
    wonAt: win.created_at,
    validatedAt: win.validated_at,
  }))

  return NextResponse.json({ wins: formattedWins })
}
