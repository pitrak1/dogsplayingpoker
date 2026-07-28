import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from './api'
import { ChatPaginationResponse } from 'dogsplayingpoker-shared/chat'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { FullMessage, Message } from 'dogsplayingpoker-shared/message'
import { ApiError } from './errors'

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

export const useChatMessages = (userId: number | undefined, chatId: number | undefined) =>
  useQuery({
    queryKey: ['chatMessages', { chatId }],
    queryFn: async () => {
      const res = await api.get(`/api/chats/${chatId}`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      return res.json() as Promise<FullMessage[]>
    },
    enabled: !!userId && !!chatId,
  })

export const useCreateMessage = () => 
  useMutation({
    mutationFn: async ({ chatId, content }: { chatId: number, content: string }) => {
      const res = await api.post(`/chats/${chatId}`, { content })
      if (!res.ok) {
        const body = (await res.json()) as { message: string; field?: string }
        throw new ApiError(body.message ?? 'Cannot send message', body.field)
      }
      return res.json() as Promise<Message>
    },
  })
  