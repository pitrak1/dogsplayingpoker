import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { CreateChatInviteInput, chatInviteSchema, paginatedChatInvitesSchema } from 'dogsplayingpoker-shared/invite'
import { chatSchema } from 'dogsplayingpoker-shared/chat'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { useAuth } from '@/context/auth'

export const useSentInvites = (params: PaginationInput) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['invites', { senderId: user?.id, page: params.page, pageSize: params.pageSize }],
    queryFn: () =>
      api.get(paginatedChatInvitesSchema, '/invites/sent', {
        page: String(params.page),
        pageSize: String(params.pageSize),
      }),
    enabled: !!user,
  })
}

export const useReceivedInvites = (params: PaginationInput) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['invites', { receiverId: user?.id, page: params.page, pageSize: params.pageSize }],
    queryFn: () =>
      api.get(paginatedChatInvitesSchema, '/invites/received', {
        page: String(params.page),
        pageSize: String(params.pageSize),
      }),
    enabled: !!user,
  })
}

export const useCreateInvite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['invites', 'create'],
    mutationFn: (input: CreateChatInviteInput) =>
      api.post(chatInviteSchema, '/invites', input),
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['invites', { senderId: invite.senderId }] })
    },
  })
}

export const useAcceptInvite = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationKey: ['invites', 'accept'],
    mutationFn: (id: number) =>
      api.patch(chatSchema.nullable(), '/invites/accept', { id }),
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
    mutationKey: ['invites', 'decline'],
    mutationFn: (id: number) =>
      api.patch(chatInviteSchema, '/invites/decline', { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites', { receiverId: user?.id }] })
    },
  })
}
