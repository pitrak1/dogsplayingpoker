import { getAvatarFallback, convertImageUrlToSize } from '@/lib/avatar'
import './avatarDisplay.scss'

type Props = {
  imageUrl?: string | null
  name: string | null
  size: number
  onClick?: () => void
  alt?: string | null
}

export function AvatarDisplay({ imageUrl, name, size, onClick, alt }: Props) {
  if (!imageUrl && !name) return

  const src = imageUrl ? convertImageUrlToSize(imageUrl, size) : getAvatarFallback(name, size)
  
  return (
    <img 
      src={src} 
      alt={alt ?? name ?? undefined} 
      style={{ 
        height: size + 'px', 
        width: size + 'px', 
      }} 
      className="avatar-display" 
      onClick={onClick} 
    />
  )
}
