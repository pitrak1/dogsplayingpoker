import { rpc } from './rpc'

export const fetchUploadSignature = async () => {
  const res = await rpc.api.media['upload-signature'].$get()
  if (!res.ok) throw new Error('Failed to get upload signature')
  return res.json()
}