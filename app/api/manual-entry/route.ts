import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { limit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local"
  
  // Rate limit: 10 attempts per minute to prevent brute force
  if (!limit(`manual_entry:${ip}`, 10)) { 
    return NextResponse.json({ error: "Trop de tentatives. Veuillez patienter." }, { status: 429 })
  }

  try {
    const { ticketId } = await req.json()

    if (!ticketId || typeof ticketId !== "string" || ticketId.trim().length === 0) {
       return NextResponse.json({ error: "Numéro de ticket invalide." }, { status: 400 })
    }

    const cleanTicketId = ticketId.trim()
    const supabase = supabaseServer()

    // Check if ticket exists
    const { data: existingTicket, error: checkError } = await supabase
      .from("tickets")
      .select("ticket_id")
      .eq("ticket_id", cleanTicketId)
      .maybeSingle()

    if (checkError) {
      console.error("Database check error:", checkError)
      return NextResponse.json({ error: "Erreur de vérification." }, { status: 500 })
    }

    if (existingTicket) {
      return NextResponse.json({ error: "Ce ticket a déjà été utilisé." }, { status: 409 })
    }

    // Insert new ticket
    const { error: insertError } = await supabase.from("tickets").insert({
      ticket_id: cleanTicketId,
      nb_pizzas_classiques: 1, // Default reward: 1 spin
      nb_pizzas_premium: 0,
      spins_simple_remaining: 1,
      spins_premium_remaining: 0,
      is_used: true,
    })

    if (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json({ error: "Erreur lors de l'enregistrement." }, { status: 500 })
    }

    return NextResponse.json({ success: true, ticket_id: cleanTicketId })
  } catch (err) {
    console.error("Manual entry error:", err)
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 })
  }
}
