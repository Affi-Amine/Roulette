import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

export async function POST(req: NextRequest) {
  const { ticket_id, nb_pizzas_classiques, nb_pizzas_premium } = await req.json()
  if (!process.env.HMAC_SECRET) {
    return NextResponse.json({ error: "Missing HMAC secret" }, { status: 500 })
  }
  const message = `${ticket_id}|${nb_pizzas_classiques}|${nb_pizzas_premium}`
  const sig = createHmac("sha256", process.env.HMAC_SECRET!).update(message).digest("hex")
  const payload = { ticket_id, nb_pizzas_classiques, nb_pizzas_premium, sig }
  const qr_url = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(JSON.stringify(payload))}`
  return NextResponse.json({ payload, qr_url })
}

