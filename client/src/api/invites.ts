import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { CreateInviteInput, ChatInvite, InvitePaginationResponse } from 'dogsplayingpoker-shared/invite'
import { PaginationInput } from 'dogsplayingpoker-shared/common'

export const useSentInvites = (userId: number | undefined, params: PaginationInput) =>
  useQuery({
    queryKey: ['invites', { senderId: userId, page: params.page, pageSize: params.pageSize }],
    queryFn: async () => {
      const res = await api.get('/api/invites/sent', {
        id: String(userId),
        page: String(params.page),
        pageSize: String(params.pageSize),
      })
      if (!res.ok) throw new Error('Failed to fetch invites')
      return res.json() as Promise<InvitePaginationResponse>
    },
    enabled: !!userId,
  })

export const useReceivedInvites = (userId: number | undefined, params: PaginationInput) =>
  useQuery({
    queryKey: ['invites', { receiverId: userId, page: params.page, pageSize: params.pageSize }],
    queryFn: async () => {
      const res = await api.get('/api/invites/received', {
        id: String(userId),
        page: String(params.page),
        pageSize: String(params.pageSize),
      })
      if (!res.ok) throw new Error('Failed to fetch invites')
      return res.json() as Promise<InvitePaginationResponse>
    },
    enabled: !!userId,
  })

export const useCreateInvite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateInviteInput) => {
      const res = await api.post('/invites', input)
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to create invite')
      return res.json() as Promise<ChatInvite>
    },
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['invites', { receiverId: invite.receiverId }] })
      queryClient.invalidateQueries({ queryKey: ['invites', { senderId: invite.senderId }] })
    },
  })
}

export const useAcceptInvite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch('/invites/accept', { id })
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to update invite')
      return res.json() as Promise<ChatInvite>
    },
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['invites', { receiverId: invite.receiverId }] })
      queryClient.invalidateQueries({ queryKey: ['invites', { senderId: invite.senderId }] })
    },
  })
}

export const useDeclineInvite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch('/invites/decline', { id })
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to update invite')
      return res.json() as Promise<ChatInvite>
    },
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['invites', { receiverId: invite.receiverId }] })
      queryClient.invalidateQueries({ queryKey: ['invites', { senderId: invite.senderId }] })
    },
  })
}
