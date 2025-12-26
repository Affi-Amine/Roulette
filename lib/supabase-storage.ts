import { supabaseServer } from "./supabase"

const BUCKET_NAME = "prize-images"
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Format non supporté. Utilisez JPG, PNG ou WebP.",
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Maximum ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    }
  }

  return { valid: true }
}

/**
 * Upload prize image to Supabase Storage
 * @param file - Image file to upload
 * @returns Public URL of uploaded image
 */
export async function uploadPrizeImage(file: File): Promise<string> {
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const supabase = supabaseServer()

  // Generate unique filename with timestamp
  const timestamp = Date.now()
  const fileExt = file.name.split(".").pop()
  const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `prizes/${fileName}`

  // Upload file to storage
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Erreur d'upload: ${error.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

  return publicUrl
}

/**
 * Delete prize image from storage
 * @param imageUrl - Full public URL of the image
 */
export async function deletePrizeImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return

  const supabase = supabaseServer()

  try {
    // Extract file path from URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/prize-images/{path}
    const urlParts = imageUrl.split("/")
    const bucketIndex = urlParts.indexOf(BUCKET_NAME)
    if (bucketIndex === -1) {
      console.warn("Invalid image URL format")
      return
    }

    const filePath = urlParts.slice(bucketIndex + 1).join("/")

    // Delete file from storage
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      console.error("Error deleting image:", error.message)
    }
  } catch (error) {
    console.error("Error parsing image URL:", error)
  }
}

/**
 * Get public URL for a storage path
 * @param storagePath - Path within the bucket
 * @returns Public URL
 */
export function getPrizeImageUrl(storagePath: string): string {
  const supabase = supabaseServer()

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath)

  return publicUrl
}
