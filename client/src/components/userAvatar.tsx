import { getAvatarFallback } from '@/lib/avatar'
import { User } from 'dogsplayingpoker-shared/user'
import { Avatar } from '@mantine/core'
import './userAvatar.scss'

type Props = {
  user: User
  size: number
}

export function UserAvatar({ user, size }: Props) {
  const src = user?.profileImageUrl ?? getAvatarFallback(user?.username, size) ?? ''
  
  return <Avatar src={src} radius="xl" alt={user?.username} style={{ height: size + 'px', width: size + 'px' }} className="avatar" />
}
