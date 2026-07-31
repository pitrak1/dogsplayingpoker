import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import { ChatPaginationResponse } from 'dogsplayingpoker-shared/chat'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { FullMessage } from 'dogsplayingpoker-shared/message'
import { useAuth } from '@/context/auth'

export const useChatMemberships = (params: PaginationInput) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['chatMemberships', { page: params.page, pageSize: params.pageSize }],
    queryFn: async () => {
      const res = await api.get('/chats', {
        page: String(params.page),
        pageSize: String(params.pageSize),
      })
      if (!res.ok) throw new Error('Failed to fetch chats')
      return res.json() as Promise<ChatPaginationResponse>
    },
    enabled: !!user,
  })
}

export const useChatMessages = (chatId: number | undefined) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['messages', { chatId }],
    queryFn: async () => {
      const res = await api.get(`/chats/${chatId}`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      return res.json() as Promise<FullMessage[]>
    },
    enabled: !!user && !!chatId,
  })
}
  