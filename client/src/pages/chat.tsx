import { useParams } from 'react-router'
import { useChatMessages, useCreateMessage } from '@/api/chats'
import { useAuth } from '@/context/auth'
import { useState } from 'react'
import './chat.scss'
import { MessageDisplay } from '@/components/messageDisplay'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'

export function Chat() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: messages } = useChatMessages(user?.id, Number(id))
  const [message, setMessage] = useState<string>('')
  const { mutateAsync: createMessage } = useCreateMessage()
  const [pageError, setPageError] = useState<string | null>(null)

  const renderMessages = () => {
    if (!messages) return null
    return messages.map((m) => (
      m.creator && <MessageDisplay 
        key={m.id} 
        message={m}
      />
    ))
  }

  const handleSendClick = async () => {
    if (message === '') return
    setPageError(null)
    try {
      await createMessage({ chatId: Number(id), content: message })
    } catch (err) {
      if (err instanceof ApiError) {
        setPageError(err.message)
      }
    }
  }

  return (
    <div className="chat">
      <ErrorBanner message={pageError} />
      {renderMessages()}
      <div className="chat__input">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)}/>
        <button className="chat__send-button" onClick={handleSendClick}>Send</button>
      </div>
    </div>
  )
}
