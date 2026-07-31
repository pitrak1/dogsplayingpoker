import { useParams } from 'react-router'
import { useChatMessages } from '@/api/chats'
import { useState, useEffect } from 'react'
import './chat.scss'
import { MessageDisplay } from '@/components/messageDisplay'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { socket } from '@/socket'
import { useQueryClient } from '@tanstack/react-query'
import { FullMessage } from 'dogsplayingpoker-shared/message'

export function Chat() {
  const { id } = useParams<{ id: string }>()
  const { data: messages } = useChatMessages(Number(id))
  const [message, setMessage] = useState<string>('')
  const [pageError, setPageError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (socket.connected) {
      socket.emit('joinChat', Number(id))
    } else {
      socket.once('connect', () => socket.emit('joinChat', Number(id)))
    }

    socket.on('messageReceived', (user, message) => {
      const newMessage = { ...message, creator: user }
      queryClient.setQueryData<FullMessage[]>(['messages', { chatId: Number(id) }], (old) => {
        if (!old) {
          return []
        } else {
          return [...old, newMessage]
        }
      })
    })

    return () => {
      socket.emit('leaveChat', Number(id))
      socket.off('messageReceived')
    }
  }, [id, queryClient])

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
      socket.emit('sendMessage', Number(id), message)
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
