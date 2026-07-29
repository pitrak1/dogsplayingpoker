import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { ChatPaginationResponse } from 'dogsplayingpoker-shared/chat'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { FullMessage, Message } from 'dogsplayingpoker-shared/message'
import { ApiError } from './errors'
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
  

export const useCreateMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ chatId, content }: { chatId: number, content: string }) => {
      const res = await api.post(`/chats/${chatId}`, { content })
      if (!res.ok) {
        const body = (await res.json()) as { message: string; field?: string }
        throw new ApiError(body.message ?? 'Cannot send message', body.field)
      }
      return res.json() as Promise<Message>
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['messages', { chatId: message.chatId }] })
    },
  })
}