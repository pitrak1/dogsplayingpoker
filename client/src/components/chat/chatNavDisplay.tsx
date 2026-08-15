import { FullChatMembership } from 'dogsplayingpoker-shared/chat'
import { AvatarDisplay } from '@/components/avatarDisplay'
import './chatNavDisplay.scss'

type Props = {
  chat: FullChatMembership
  onViewChat: (chatId: number) => void
}

export function ChatNavDisplay({ chat, onViewChat }: Props) {
  const { otherUser } = chat

  const lastMessage = 'Some last message here'
  
  return (
    <button className="chat-nav-display" onClick={(_e) => onViewChat(chat.chatId)}>
      <AvatarDisplay imageUrl={otherUser?.profileImageUrl} name={otherUser?.username ?? null} size={64} />
      <div className="chat-nav-display__info">
        <div className="chat-nav-display__username">{otherUser?.username}</div>
        {lastMessage ?
          (
            <div className="chat-nav-display__message">{lastMessage}</div>
          ) : (
            <div className="chat-nav-display__empty">Start your conversation!</div>
          )
        }
      </div>
    </button>
  )
}
