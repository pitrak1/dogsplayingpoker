import { useChatMemberships } from '@/api/chats'
import { ChatNavDisplay } from '@/components/chat/chatNavDisplay'
import './chatsNavSidebar.scss'

type Props = {
  onViewChatClick: (chatId: number) => void
}

export function ChatsNavSidebar({ onViewChatClick }: Props) {
  const { data } = useChatMemberships({ page: 1, pageSize: 25 })

  const hasChats = data?.chats && data?.chats.length > 0

  return (
    <div className="chats-nav-sidebar">
      {hasChats && data.chats.map((c) => (
        c.otherUser && <ChatNavDisplay
          key={c.chatId}
          chat={c}
          onViewChat={onViewChatClick}
        />
      ))}
    </div>
  )
}
