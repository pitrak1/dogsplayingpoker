export const userTypeDefs = `
  type User {
    id: Int!
    username: String!
    email: String!
    profileImageUrl: String
    latitude: Float
    longitude: Float
    radiusMiles: Int
    createdAt: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type AuthPayload {
    authToken: String!
    user: User!
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!, profileImageUrl: String, latitude: Float, longitude: Float, radiusMiles: Int): AuthPayload!
    loginUser(email: String!, password: String!): AuthPayload!
    refreshToken: AuthPayload!
  }
`