import { gql } from '@apollo/client'

export type CreateUserData = {
  user: {
    id: number
    username: string
    email: string
  }
}

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $username: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`