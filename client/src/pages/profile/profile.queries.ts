import { gql } from '@apollo/client'

export const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      username
      profileImageUrl
      latitude
      longitude
      createdAt
      pets {
        id
        name
        age
        size
        breed
        pictureUrl
      }
    }
  }
`
