import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.get("query") || ""

  const supabase = supabaseServer()

  // 1. Search users by name/email
  const { data: usersByName } = await supabase
    .from("users")
    .select(
      `id,name,email,user_prizes(id,status,created_at,prize:prizes(name,emoji,color))`
    )
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)

  // 2. Search by ticket_id
  // First find the ticket, then the user
  const { data: tickets } = await supabase
    .from("tickets")
    .select("user_id")
    .ilike("ticket_id", `%${query}%`)
    .not("user_id", "is", null)

  let usersByTicket: any[] = []
  if (tickets && tickets.length > 0) {
    const userIds = tickets.map(t => t.user_id)
    const { data: users } = await supabase
      .from("users")
      .select(
        `id,name,email,user_prizes(id,status,created_at,prize:prizes(name,emoji,color))`
      )
      .in("id", userIds)
    
    if (users) usersByTicket = users
  }

  // Merge results (deduplicate by id)
  const allUsers = [...(usersByName || []), ...usersByTicket]
  const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values())

  return NextResponse.json({ users: uniqueUsers })
}
