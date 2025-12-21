import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"
import { ClaimPrizesSchema } from "@/lib/validation"

export async function POST(req: NextRequest) {
  const parse = ClaimPrizesSchema.safeParse(await req.json())
  if (!parse.success) {
    return NextResponse.json({ error_code: "bad_request", message: "Invalid payload", details: parse.error.flatten() }, { status: 400 })
  }
  const { ticket_id, name, phone, spin_ids } = parse.data

  const supabase = supabaseServer()

  let { data: user } = await supabase.from("users").select("*").eq("phone", phone).maybeSingle()

  if (!user) {
    const { data: newUser } = await supabase.from("users").insert({ name, phone }).select().maybeSingle()
    user = newUser
  }

  await supabase.from("tickets").update({ user_id: (user as any).id }).eq("ticket_id", ticket_id)

  const { data: spins } = await supabase.from("spins").select("id, prize_id").in("id", spin_ids)

  const userPrizes = (spins || []).map((spin: any) => ({
    user_id: (user as any).id,
    spin_id: spin.id,
    prize_id: spin.prize_id,
    status: "obtained",
  }))

  await supabase.from("user_prizes").insert(userPrizes)

  return NextResponse.json({ success: true, user_id: (user as any).id })
}
