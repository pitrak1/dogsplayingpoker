export const userTypeDefs = `
  type User {
    id: Int!
    username: String!
    email: String!
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
    createUser(username: String!, email: String!, password: String!): AuthPayload!
    loginUser(email: String!, password: String!): AuthPayload!
    refreshToken: AuthPayload!
  }
`