import { api } from './api'
import { uploadSignatureSchema } from 'dogsplayingpoker-shared/user'

export const fetchUploadSignature = async () => {
  const res = await api.get('/media/upload-signature')
  if (!res.ok) throw new Error('Failed to get upload signature')
  return uploadSignatureSchema.parse(await res.json())
}
