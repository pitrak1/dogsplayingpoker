import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rpc } from './rpc'
import { InferRequestType } from 'hono'

type CreatePetInput = InferRequestType<typeof rpc.api.pets.$post>['json']

export const usePetsForOwner = (ownerId: number | undefined) =>
  useQuery({
    queryKey: ['pets', { ownerId }],
    queryFn: async () => {
      const res = await rpc.api.pets.$get({ query: { ownerId: String(ownerId) } })
      if (!res.ok) throw new Error('Failed to fetch pets')
      return res.json()
    },
    enabled: !!ownerId,
  })

export const usePet = (id: number | undefined) =>
  useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const res = await rpc.api.pets[':id'].$get({ param: { id: String(id) } })
      if (!res.ok) throw new Error('Failed to fetch pet')
      return res.json()
    },
    enabled: !!id,
  })

export const useCreatePet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreatePetInput) => {
      const res = await rpc.api.pets.$post({ json: input })
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to create pet')
      return res.json()
    },
    onSuccess: (pet) => {
      queryClient.invalidateQueries({ queryKey: ['pets', { ownerId: pet.ownerId }] })
    },
  })
}
