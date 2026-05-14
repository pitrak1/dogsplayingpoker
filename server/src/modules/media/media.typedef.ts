export const mediaTypeDefs = `
  type UploadSignature {
    timestamp: Int!
    signature: String!
  }

  type Query {
    uploadSignature: UploadSignature!
  }
`