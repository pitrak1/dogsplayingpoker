import { api } from './api'
import { uploadSignatureSchema } from 'dogsplayingpoker-shared/user'

export const fetchUploadSignature = () =>
  api.get(uploadSignatureSchema, '/media/upload-signature')
