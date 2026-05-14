import { gql } from '@apollo/client'

export const GET_UPLOAD_SIGNATURE = gql`
  query getUploadSignature {
    uploadSignature {
      timestamp
      signature
    }
  }
`
