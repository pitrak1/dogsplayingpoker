import { useChatMessages } from '@/api/chats'
import { useState, useEffect, useMemo } from 'react'
import './chat.scss'
import { MessageGroupDisplay } from '@/components/chat/messageGroupDisplay'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { socket } from '@/socket'
import { useQueryClient } from '@tanstack/react-query'
import { FullMessage } from 'dogsplayingpoker-shared/message'
import { ChatInput } from './chatInput'
import { groupMessages } from '@/lib/groupMessages'

type Props = {
  id: number
}

export function Chat({ id }: Props) {
  const { data: messages } = useChatMessages(Number(id))
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

  const handleSendClick = async (message: string) => {
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

  const messageGroups = useMemo(() => groupMessages(messages ?? []), [messages])

  return (
    <div className="chat">
      <ErrorBanner message={pageError} />
      <div className="chat__messages">
        {messageGroups?.map(m => (
          <MessageGroupDisplay group={m} />
        ))}
      </div>
      <ChatInput onSend={handleSendClick} />
    </div>
  )
}
