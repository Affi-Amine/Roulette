import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const supabase = supabaseServer()

  // Fetch users with their prizes
  const { data: users, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      created_at,
      user_prizes(count),
      tickets(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Format the response
  const formattedUsers = users.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    prizesCount: u.user_prizes[0]?.count || 0,
    ticketsCount: u.tickets[0]?.count || 0,
    joinedAt: u.created_at,
  }))

  return NextResponse.json({ users: formattedUsers })
}
