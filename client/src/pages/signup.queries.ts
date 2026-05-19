import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $username: String!, $password: String!, $profileImageUrl: String) {
    createUser(username: $username, email: $email, password: $password, profileImageUrl: $profileImageUrl) {
      authToken
      user {
        id
        username
        email
        profileImageUrl
      }
    }
  }
`
