import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import { ChatPaginationResponse } from 'dogsplayingpoker-shared/chat'
import { PaginationInput } from 'dogsplayingpoker-shared/common'

export const useChatMemberships = (userId: number | undefined, params: PaginationInput) =>
  useQuery({
    queryKey: ['chatMemberships', { userId }],
    queryFn: async () => {
      const res = await api.get('/api/chats', {
        id: String(userId),
        page: String(params.page),
        pageSize: String(params.pageSize),
      })
      if (!res.ok) throw new Error('Failed to fetch chats')
      return res.json() as Promise<ChatPaginationResponse>
    },
    enabled: !!userId,
  })
