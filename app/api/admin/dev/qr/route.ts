import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import QRCode from "qrcode"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const ticket_id = url.searchParams.get("ticket_id") || ""
  const nb_pizzas_classiques = Number(url.searchParams.get("nb_pizzas_classiques") || 0)
  const nb_pizzas_premium = Number(url.searchParams.get("nb_pizzas_premium") || 0)

  if (!ticket_id || isNaN(nb_pizzas_classiques) || isNaN(nb_pizzas_premium)) {
    return NextResponse.json({ error: "Missing or invalid params" }, { status: 400 })
  }
  if (!process.env.HMAC_SECRET) {
    return NextResponse.json({ error: "Missing HMAC secret" }, { status: 500 })
  }

  const message = `${ticket_id}|${nb_pizzas_classiques}|${nb_pizzas_premium}`
  const sig = createHmac("sha256", process.env.HMAC_SECRET!).update(message).digest("hex")
  const payload = { ticket_id, nb_pizzas_classiques, nb_pizzas_premium, sig }

  const pngBuffer = await QRCode.toBuffer(JSON.stringify(payload), { width: 300, margin: 1 })
  return new NextResponse(pngBuffer as any, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  })
}

