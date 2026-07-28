import { FullMessage } from 'dogsplayingpoker-shared/message'
import { getAvatarFallback } from '@/lib/avatar'

import './messageDisplay.scss'

type Props = {
  message: FullMessage
}

export function MessageDisplay({ message }: Props) {
  const user = message.creator
  const src = user?.profileImageUrl ?? getAvatarFallback(user?.username, 128)
  
  return (
    <div className="message-display">
      <img src={src} alt={user?.username} className="message-display__image" />
      <div className="message-display__info">
        <div className="message-display__username">{user?.username}</div>
        <div className="message-display__content">{message.content}</div>
      </div>
    </div>
  )
}
