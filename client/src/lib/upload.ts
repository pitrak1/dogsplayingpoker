import { GET_UPLOAD_SIGNATURE } from './upload.queries'
import { client }from '@/apollo'

type UploadSignature = {
  uploadSignature: {
    timestamp: number;
    signature: string;
  }
}

export const uploadImage = async (file: File): Promise<string> => {
  // 1. get signature from your server
  const { data: { uploadSignature: { timestamp, signature }}} = await client.query<UploadSignature>({ query: GET_UPLOAD_SIGNATURE })

  // 2. upload directly to Cloudinary
  const formData = new FormData()
  formData.append('file', file)
  formData.append('timestamp', timestamp.toString())
  formData.append('signature', signature)
  formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  const data = await res.json()
  return data.secure_url
}