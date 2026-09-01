import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import { paginatedChatsSchema } from 'dogsplayingpoker-shared/chat'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { fullMessageSchema } from 'dogsplayingpoker-shared/message'
import { z } from 'zod'
import { useAuth } from '@/context/auth'

export const useChatMemberships = (params: PaginationInput) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['chatMemberships', { page: params.page, pageSize: params.pageSize }],
    queryFn: () =>
      api.get(paginatedChatsSchema, '/chats', {
        page: String(params.page),
        pageSize: String(params.pageSize),
      }),
    enabled: !!user,
  })
}

export const useChatMessages = (chatId: number | undefined) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['messages', { chatId }],
    queryFn: () => api.get(z.array(fullMessageSchema), `/chats/${chatId}`),
    enabled: !!user && !!chatId,
  })
}
