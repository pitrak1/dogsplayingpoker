export const playerTypeDefs = `
  type Player {
    id: Int!
    name: String!
    chips: Int!
  }

  type Query {
    players: [Player!]!
    player(id: Int!): Player
  }

  type Mutation {
    addPlayer(name: String!, chips: Int!): Player!
  }
`