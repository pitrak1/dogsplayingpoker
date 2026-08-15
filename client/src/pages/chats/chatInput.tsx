import { useState } from 'react'
import { ActionIcon, Textarea } from '@mantine/core'
import { SendHorizontal } from 'lucide-react'
import './chatInput.scss'

type Props = {
  onSend: (message: string) => void
}

export function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState<string>('')

  const handleSendClicked = (e: React.MouseEvent) => {
    e.preventDefault()
    onSend(message)
    setMessage('')
  }

  const handleEnterPressed = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(message)
      setMessage('')
    }
  }

  return (
    <div className="chat-input">
      <Textarea 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        onKeyDown={handleEnterPressed}
        placeholder="Message..." 
        w="100%" 
      />
      <ActionIcon onClick={handleSendClicked} size="xl" aria-label='send button'>
        <SendHorizontal size={32} />
      </ActionIcon>
    </div>
  )
}
