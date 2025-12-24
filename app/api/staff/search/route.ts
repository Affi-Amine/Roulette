import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.get("query") || ""

  const supabase = supabaseServer()

  const { data: users } = await supabase
    .from("users")
    .select(
      `id,name,email,user_prizes(id,status,created_at,prize:prizes(name,emoji,color))`
    )
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)

  return NextResponse.json({ users })
}
