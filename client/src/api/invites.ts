import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { CreateInviteInput, chatInviteSchema, invitePaginationResponseSchema } from 'dogsplayingpoker-shared/invite'
import { chatSchema } from 'dogsplayingpoker-shared/chat'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { useAuth } from '@/context/auth'

export const useSentInvites = (params: PaginationInput) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['invites', { senderId: user?.id, page: params.page, pageSize: params.pageSize }],
    queryFn: async () => {
      const res = await api.get('/invites/sent', {
        page: String(params.page),
        pageSize: String(params.pageSize),
      })
      if (!res.ok) throw new Error('Failed to fetch invites')
      return invitePaginationResponseSchema.parse(await res.json())
    },
    enabled: !!user,
  })
}

export const useReceivedInvites = (params: PaginationInput) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['invites', { receiverId: user?.id, page: params.page, pageSize: params.pageSize }],
    queryFn: async () => {
      const res = await api.get('/invites/received', {
        page: String(params.page),
        pageSize: String(params.pageSize),
      })
      if (!res.ok) throw new Error('Failed to fetch invites')
      return invitePaginationResponseSchema.parse(await res.json())
    },
    enabled: !!user,
  })
}

export const useCreateInvite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateInviteInput) => {
      const res = await api.post('/invites', input)
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to create invite')
      return chatInviteSchema.parse(await res.json())
    },
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['invites', { senderId: invite.senderId }] })
    },
  })
}

export const useAcceptInvite = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch('/invites/accept', { id })
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to update invite')
      return chatSchema.nullable().parse(await res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites', { receiverId: user?.id }] })
      queryClient.invalidateQueries({ queryKey: ['chatMemberships'] })
    },
  })
}

export const useDeclineInvite = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch('/invites/decline', { id })
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to update invite')
      return chatInviteSchema.parse(await res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites', { receiverId: user?.id }] })
    },
  })
}
