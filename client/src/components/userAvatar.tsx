import { getAvatarFallback, convertImageUrlToSize } from '@/lib/avatar'
import { User } from 'dogsplayingpoker-shared/user'
import './userAvatar.scss'

type Props = {
  user: User | null
  size: number
  onClick?: () => void
  alt?: string | null
}

export function UserAvatar({ user, size, onClick, alt }: Props) {
  if (!user) return

  const src = user.profileImageUrl ? convertImageUrlToSize(user.profileImageUrl, size) : getAvatarFallback(user?.username, size)
  
  return (
    <img 
      src={src} 
      alt={alt ?? user?.username} 
      style={{ 
        height: size + 'px', 
        width: size + 'px', 
      }} 
      className="user-avatar" 
      onClick={onClick} 
    />
  )
}
