import { NextRequest, NextResponse } from "next/server"
import { uploadPrizeImage } from "@/lib/supabase-storage"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    const imageUrl = await uploadPrizeImage(file)

    return NextResponse.json({ imageUrl })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Erreur lors de l'upload" }, { status: 500 })
  }
}
