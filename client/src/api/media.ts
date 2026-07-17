import { api } from './api'
import { UploadSignature } from 'dogsplayingpoker-shared/user'

export const fetchUploadSignature = async () => {
  const res = await api.get('/api/media/upload-signature')
  if (!res.ok) throw new Error('Failed to get upload signature')
  return res.json() as Promise<UploadSignature>
}
