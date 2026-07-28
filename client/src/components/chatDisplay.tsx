import { FullChatMembership } from 'dogsplayingpoker-shared/chat'
import { getAvatarFallback } from '@/lib/avatar'

import './chatDisplay.scss'
import { User } from 'dogsplayingpoker-shared/user'

type Props = {
  chat: FullChatMembership
  onViewProfile: (user: User) => void
  onViewChat: (chatId: number) => void
}

export function ChatDisplay({ chat, onViewProfile, onViewChat }: Props) {
  const { otherUser } = chat
  const src = otherUser?.profileImageUrl ?? getAvatarFallback(otherUser?.username, 128)
  
  return (
    <div className="chat-display">
      <img src={src} alt={otherUser?.username} className="chat-display__image" />
      <div className="chat-display__info">
        <div className="chat-display__username">{otherUser?.username}</div>
        {/* {chat.lastMessage ? (
          (
            <div className="chat-display__message">{chat.lastMessage}</div>
          ) : (
            <div className="chat-display__empty">Start your conversation!</div>
          )
        )} */}
        <div className="chat-display__buttons">
          <button className="chat-display__profile-button" onClick={() => { if (otherUser) onViewProfile(otherUser) }}>View profile</button>
          <button className="chat-display__view-button" onClick={() => onViewChat(chat.chatId)}>View chat</button>
        </div>
      </div>
    </div>
  )
}
