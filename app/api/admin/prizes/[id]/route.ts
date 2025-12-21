import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = supabaseServer()
  const body = await req.json()
  const { error } = await supabase.from("prizes").update(body).eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = supabaseServer()
  const { error } = await supabase.from("prizes").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

