import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { CreatePetInput, Pet } from 'dogsplayingpoker-shared/pet'

export const usePetsForOwner = (ownerId: number | undefined) =>
  useQuery({
    queryKey: ['pets', { ownerId }],
    queryFn: async () => {
      const res = await api.get('/api/pets', { ownerId: String(ownerId) })
      if (!res.ok) throw new Error('Failed to fetch pets')
      return res.json() as Promise<Pet[]>
    },
    enabled: !!ownerId,
  })

export const usePet = (id: number | undefined) =>
  useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const res = await api.get(`/api/pets/${id}`)
      if (!res.ok) throw new Error('Failed to fetch pet')
      return res.json() as Promise<Pet>
    },
    enabled: !!id,
  })

export const useCreatePet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreatePetInput) => {
      const res = await api.post('/pets', input)
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to create pet')
      return res.json() as Promise<Pet>
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
      const res = await api.put(`/pets/${id}`, input)
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to edit pet')
      return res.json() as Promise<Pet>
    },
    onSuccess: (pet) => {
      queryClient.invalidateQueries({ queryKey: ['pets', { ownerId: pet.ownerId }] })
      queryClient.invalidateQueries({ queryKey: ['pet', pet.id] })
    },
  })
}
