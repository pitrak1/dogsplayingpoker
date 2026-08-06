import { getAvatarFallback } from '@/lib/avatar'
import { User } from 'dogsplayingpoker-shared/user'
import './userAvatar.scss'

type Props = {
  user: User
  size: number
  onClick?: () => void
}

export function UserAvatar({ user, size, onClick }: Props) {
  const src = user?.profileImageUrl ?? getAvatarFallback(user?.username, size) ?? ''
  
  return (
    <img 
      src={src} 
      alt={user?.username} 
      style={{ 
        height: size + 'px', 
        width: size + 'px', 
      }} 
      className="user-avatar" 
      onClick={onClick} 
    />
  )
}
