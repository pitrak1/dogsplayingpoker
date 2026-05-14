import { User } from '@/types/user'

export type AuthPayload = {
  authToken: string
  user: User
}
