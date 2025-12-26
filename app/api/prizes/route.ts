import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = supabaseServer()

    // Fetch only active prizes
    const { data: prizes, error } = await supabase
      .from("prizes")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching prizes:", error)
      return NextResponse.json({ error: "Erreur lors de la récupération des gains" }, { status: 500 })
    }

    return NextResponse.json({ prizes: prizes || [] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
