import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { SpinSchema } from "@/lib/validation"
import { limit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local"
  if (!limit(`spin:${ip}`, 20)) {
    return NextResponse.json({ error_code: "rate_limited", message: "Too many requests" }, { status: 429 })
  }
  const parse = SpinSchema.safeParse(await req.json())
  if (!parse.success) {
    return NextResponse.json({ error_code: "bad_request", message: "Invalid payload", details: parse.error.flatten() }, { status: 400 })
  }
  const { ticket_id, spin_type } = parse.data

  const supabase = supabaseServer()

  const { data: ticket, error } = await supabase.from("tickets").select("*").eq("ticket_id", ticket_id).maybeSingle()

  if (error || !ticket) {
    return NextResponse.json({ error_code: "not_found", message: "Ticket not found" }, { status: 404 })
  }

  const remainingKey = spin_type === "simple" ? "spins_simple_remaining" : "spins_premium_remaining"

  if ((ticket as any)[remainingKey] <= 0) {
    return NextResponse.json({ error_code: "no_spins", message: "No spins remaining" }, { status: 400 })
  }

  const { data: prizeId } = await supabase.rpc("select_random_prize", { spin_type })

  const { data: prize } = await supabase.from("prizes").select("*").eq("id", prizeId).maybeSingle()

  const { data: spin } = await supabase
    .from("spins")
    .insert({ ticket_id, prize_id: prizeId, spin_type })
    .select()
    .maybeSingle()

  await supabase
    .from("tickets")
    .update({ [remainingKey]: (ticket as any)[remainingKey] - 1 })
    .eq("ticket_id", ticket_id)

  return NextResponse.json({
    spin_id: (spin as any)?.id,
    prize_id: (prize as any)?.id,
    prize_name: (prize as any)?.name,
    prize_emoji: (prize as any)?.emoji,
    prize_image: (prize as any)?.image_url,
    prize_color: (prize as any)?.color,
  })
}
