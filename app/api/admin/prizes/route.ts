import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  const supabase = supabaseServer()
  const { data } = await supabase.from("prizes").select("*").order("created_at", { ascending: false })
  return NextResponse.json({ prizes: data || [] })
}

export async function POST(req: NextRequest) {
  const supabase = supabaseServer()
  const body = await req.json()
  const { error } = await supabase.from("prizes").insert(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

