import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $username: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      authToken
      user {
        id
        username
        email
      }
    }
  }
`