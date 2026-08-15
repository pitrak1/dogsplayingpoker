import { Chat } from './chat'
import { useNavigate, useParams } from 'react-router'
import { ChatsNavSidebar } from './chatsNavSidebar'
import './chats.scss'

export function Chats() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();

  const handleViewChatClick = (chatId: number) => {
    navigate(`/chats/${chatId}`)
  }

  return (
    <div className="chats">
      <div className="chats__nav">
        <ChatsNavSidebar 
          onViewChatClick={handleViewChatClick} 
        />
      </div>
      <div className="chats__body">
        {id ? (
          <Chat id={Number(id)} />
        ) : (
          <div>Select a chat from the sidebar</div>
        )}
      </div>
    </div>
  )
}
