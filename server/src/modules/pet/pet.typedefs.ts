export const petTypeDefs = `
  enum Reactivity {
    strong
    mixed
    none
    unknown
  }

  enum Size {
    giant
    large
    medium
    small
    toy
    unknown
  }

  type Pet {
    id: Int!
    name: String!
    age: Int!
    size: Size!
    breed: String!
    pictureUrl: String
    dogReactivity: Reactivity!
    dogReactivityNotes: String
    catReactivity: Reactivity!
    catReactivityNotes: String
    kidReactivity: Reactivity!
    kidReactivityNotes: String
    peopleReactivity: Reactivity!
    peopleReactivityNotes: String
  }

  type Query {
    pets(ownerId: Int!): [Pet!]!
    pet(id: Int!): Pet
  }

  type Mutation {
    addPet(name: String!, age: Int!, size: Size!, breed: String!, pictureUrl: String, dogReactivity: Reactivity!, dogReactivityNotes: String, catReactivity: Reactivity!, catReactivityNotes: String, kidReactivity: Reactivity!, kidReactivityNotes: String, peopleReactivity: Reactivity!, peopleReactivityNotes: String): Pet!
  }
`