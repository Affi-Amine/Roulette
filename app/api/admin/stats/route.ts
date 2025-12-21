import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const supabase = supabaseServer()

  const { count: totalTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true })
  const { count: totalPrizes } = await supabase.from("user_prizes").select("*", { count: "exact", head: true })
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { data: prizeStats } = await supabase
    .from("user_prizes")
    .select("prize_id, prizes(name)")
    .eq("status", "obtained")

  return NextResponse.json({ totalTickets, totalPrizes, totalUsers, prizeStats })
}

