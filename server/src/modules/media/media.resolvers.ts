import { getUploadSignature } from '@/services/cloudinary'

export const mediaResolvers = {
  Query: {
    uploadSignature: () => getUploadSignature(),
  },
}