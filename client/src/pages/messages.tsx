import { useChatMemberships } from '@/api/chats'
import { useAuth } from '@/context/auth'

import './messages.scss'

export function Messages() {
  const { user } = useAuth()
  console.log(user?.id)
  const { data: chats } = useChatMemberships(user?.id, { page: 1, pageSize: 25 })
  console.log(chats)
  return <div className="messages">Messages</div>
}
