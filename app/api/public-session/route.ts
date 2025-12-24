import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { limit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local"
  
  // Rate limit public session creation to prevent massive abuse
  // 10 per minute per IP seems reasonable for a public wifi scenario
  if (!limit(`public_session:${ip}`, 10)) {
    return NextResponse.json({ error_code: "rate_limited", message: "Too many requests" }, { status: 429 })
  }

  const supabase = supabaseServer()
  const ticketId = `PUB-${crypto.randomUUID()}`

  // Create a ticket with 1 simple spin
  const { error } = await supabase.from("tickets").insert({
    ticket_id: ticketId,
    nb_pizzas_classiques: 1,
    nb_pizzas_premium: 0,
    spins_simple_remaining: 1,
    spins_premium_remaining: 0,
    is_used: true, // Mark as "verified/activated"
  })

  if (error) {
    console.error("Error creating public ticket:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }

  return NextResponse.json({ ticket_id: ticketId })
}
