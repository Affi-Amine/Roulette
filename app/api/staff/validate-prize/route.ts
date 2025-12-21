import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { prize_id } = await req.json()
  
  const supabase = supabaseServer()

  const { error } = await supabase
    .from("user_prizes")
    .update({ status: "validated", validated_at: new Date().toISOString() })
    .eq("id", prize_id)

  if (error) {
    return NextResponse.json({ error_code: "db_error", message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
