import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import { chatPaginationResponseSchema } from 'dogsplayingpoker-shared/chat'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { fullMessageSchema } from 'dogsplayingpoker-shared/message'
import { z } from 'zod'
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
      return chatPaginationResponseSchema.parse(await res.json())
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
      return z.array(fullMessageSchema).parse(await res.json())
    },
    enabled: !!user && !!chatId,
  })
}
  