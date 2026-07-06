import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rpc } from './rpc'
import { CreatePetInput } from 'dogsplayingpoker-shared/schemas/pet'


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

export const useEditPet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: number, input: CreatePetInput }) => {
      const res = await rpc.api.pets[':id'].$put({ 
        param: { id: String(id) }, 
        json: input 
      })
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to edit pet')
      return res.json()
    },
    onSuccess: (pet) => {
      queryClient.invalidateQueries({ queryKey: ['pets', { ownerId: pet.ownerId }] })
      queryClient.invalidateQueries({ queryKey: ['pet', pet.id] })
    },
  })
}
