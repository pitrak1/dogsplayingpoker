import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rpc } from './rpc'
import { CreateInviteInput } from 'dogsplayingpoker-shared/schemas/invite'
import { PaginationInput } from '@server/types'


// export const usePetsForOwner = (ownerId: number | undefined) =>
//   useQuery({
//     queryKey: ['pets', { ownerId }],
//     queryFn: async () => {
//       const res = await rpc.api.pets.$get({ query: { ownerId: String(ownerId) } })
//       if (!res.ok) throw new Error('Failed to fetch pets')
//       return res.json()
//     },
//     enabled: !!ownerId,
//   })

// export const usePet = (id: number | undefined) =>
//   useQuery({
//     queryKey: ['pet', id],
//     queryFn: async () => {
//       const res = await rpc.api.pets[':id'].$get({ param: { id: String(id) } })
//       if (!res.ok) throw new Error('Failed to fetch pet')
//       return res.json()
//     },
//     enabled: !!id,
//   })

// export const usePetsForOwner = (ownerId: number | undefined) =>
//   useQuery({
//     queryKey: ['pets', { ownerId }],
//     queryFn: async () => {
//       const res = await rpc.api.pets.$get({ query: { ownerId: String(ownerId) } })
//       if (!res.ok) throw new Error('Failed to fetch pets')
//       return res.json()
//     },
//     enabled: !!ownerId,
//   })

export const useSentInvites = (userId: number | undefined, params: PaginationInput) =>
  useQuery({
    queryKey: ['invites', { senderId: userId }],
    queryFn: async () => {
      const query = {
        userId: String(userId),
        page: String(params.page),
        pageSize: String(params.pageSize)
      }
      const res = await rpc.api.invites['sent'].$get({ query })
      if (!res.ok) throw new Error('Failed to fetch invites')
      return res.json()
    },
    enabled: !!userId,
  })

export const useReceivedInvites = (userId: number | undefined, params: PaginationInput) =>
  useQuery({
    queryKey: ['invites', { receiverId: userId }],
    queryFn: async () => {
      const query = {
        userId: String(userId),
        page: String(params.page),
        pageSize: String(params.pageSize)
      }
      const res = await rpc.api.invites['received'].$get({ query })
      if (!res.ok) throw new Error('Failed to fetch invites')
      return res.json()
    },
    enabled: !!userId,
  })

export const useCreateInvite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateInviteInput) => {
      const res = await rpc.api.invites.$post({ json: input })
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to create invite')
      return res.json()
    },
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['invites', { receiverId: invite.receiverId }] })
    },
  })
}

// export const useEditPet = () => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async ({ id, input }: { id: number, input: CreatePetInput }) => {
//       const res = await rpc.api.pets[':id'].$put({ 
//         param: { id: String(id) }, 
//         json: input 
//       })
//       if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to edit pet')
//       return res.json()
//     },
//     onSuccess: (pet) => {
//       queryClient.invalidateQueries({ queryKey: ['pets', { ownerId: pet.ownerId }] })
//       queryClient.invalidateQueries({ queryKey: ['pet', pet.id] })
//     },
//   })
// }
