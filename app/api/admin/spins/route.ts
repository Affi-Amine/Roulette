import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  const supabase = supabaseServer()
  const { data } = await supabase
    .from("spins")
    .select("created_at, spin_type, ticket_id, prize:prizes(name,emoji,color)")
    .order("created_at", { ascending: false })
    .limit(100)
  return NextResponse.json({ spins: data || [] })
}

