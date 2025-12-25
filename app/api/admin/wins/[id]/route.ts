import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = supabaseServer()

  // Verify the prize exists and is not already validated (optional check)
  
  const { error } = await supabase
    .from("user_prizes")
    .update({ 
      status: "validated",
      validated_at: new Date().toISOString()
    })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
