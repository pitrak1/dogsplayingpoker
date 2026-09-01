import { ApiError } from '@/api/errors'
import { fetchUploadSignature } from '@/api/media'
import { z } from 'zod'

const uploadResponseSchema = z.object({ secure_url: z.url() })
const uploadErrorSchema = z.object({ error: z.object({ message: z.string() }) })

// This check makes sure that when we get the environment variables, they are valid and present
const envSchema = z.object({
  VITE_CLOUDINARY_API_KEY: z.string().min(1),
  VITE_CLOUDINARY_CLOUD_NAME: z.string().min(1),
})

let env: z.infer<typeof envSchema> | null = null
const getEnv = () => (env ??= envSchema.parse(import.meta.env))

export const uploadImage = async (file: File): Promise<string> => {
  // These are both okay to have here because the api secret is what's actually required to sign these
  // However, we should tighten up formats and upload limits
  const { VITE_CLOUDINARY_API_KEY, VITE_CLOUDINARY_CLOUD_NAME } = getEnv()

  // 1. get signature from your server
  const { timestamp, signature } = await fetchUploadSignature()

  // 2. upload directly to Cloudinary
  const formData = new FormData()
  formData.append('file', file)
  formData.append('timestamp', timestamp.toString())
  formData.append('signature', signature)
  formData.append('api_key', VITE_CLOUDINARY_API_KEY)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  )

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const failure = uploadErrorSchema.safeParse(body)
    throw new ApiError(
      failure.success ? failure.data.error.message : `Upload failed (${res.status})`,
    )
  }

  const result = uploadResponseSchema.safeParse(body)
  if (!result.success) throw new ApiError('Upload succeeded but returned no image URL')

  return result.data.secure_url
}
