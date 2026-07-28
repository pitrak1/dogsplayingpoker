import { useChatMemberships } from '@/api/chats'
import { useAuth } from '@/context/auth'
import { ChatDisplay } from '@/components/chatDisplay'
import { User } from 'dogsplayingpoker-shared/user'
import { useNavigate } from 'react-router'

import './chats.scss'

export function Chats() {
  const { user } = useAuth()
  const navigate = useNavigate();
  const { data } = useChatMemberships(user?.id, { page: 1, pageSize: 25 })

  const hasChats = data?.chats && data?.chats.length > 0

  const handleViewProfileClick = (user: User) => {
    navigate(`/profile/${user.username}`)
  }

  const handleViewChatClick = (chatId: number) => {
    navigate(`/chats/${chatId}`)
  }

  const renderChats = () => {
    if (!hasChats) return
    return data.chats.map((c) => (
      c.otherUser && <ChatDisplay
        key={c.chatId}
        chat={c}
        onViewProfile={handleViewProfileClick}
        onViewChat={handleViewChatClick}
      />
    ))
  }

  return (
    <div className="chats">
      <h1 className="chats__title">Your chats</h1>
      {renderChats()}
    </div>
  )
}
