import { NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { supabaseServer } from "@/lib/supabase"
import { VerifyTicketSchema } from "@/lib/validation"
import { limit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local"
  if (!limit(`verify:${ip}`, 10)) {
    return NextResponse.json({ error_code: "rate_limited", message: "Too many requests" }, { status: 429 })
  }

  const parse = VerifyTicketSchema.safeParse(await req.json())
  if (!parse.success) {
    return NextResponse.json({ error_code: "bad_request", message: "Invalid payload", details: parse.error.flatten() }, { status: 400 })
  }
  const { ticket_id, nb_pizzas_classiques, nb_pizzas_premium, sig } = parse.data

  if (!process.env.HMAC_SECRET) {
    return NextResponse.json({ error: "Missing HMAC secret" }, { status: 500 })
  }

  const message = `${ticket_id}|${nb_pizzas_classiques}|${nb_pizzas_premium}`
  const expectedSigHex = createHmac("sha256", process.env.HMAC_SECRET!).update(message).digest("hex")
  if (sig.length !== expectedSigHex.length) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }
  const ok = timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSigHex, "hex"))
  if (!ok) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = supabaseServer()

  const { data: existingTicket } = await supabase
    .from("tickets")
    .select("ticket_id")
    .eq("ticket_id", ticket_id)
    .maybeSingle()

  if (existingTicket) {
    return NextResponse.json({ error: "Ticket already used" }, { status: 409 })
  }

  const spins_simple = nb_pizzas_classiques
  const spins_premium = nb_pizzas_premium

  if (spins_simple === 0 && spins_premium === 0) {
    return NextResponse.json({ error: "No spins available" }, { status: 400 })
  }

  const { error: insertError } = await supabase.from("tickets").insert({
    ticket_id,
    nb_pizzas_classiques,
    nb_pizzas_premium,
    spins_simple_remaining: spins_simple,
    spins_premium_remaining: spins_premium,
    is_used: true,
  })

  if (insertError) {
    return NextResponse.json({ error_code: "db_error", message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({
    valid: true,
    ticket_id,
    spins: { simple: spins_simple, premium: spins_premium },
  })
}
