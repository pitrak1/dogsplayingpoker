import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { CreatePetInput, petSchema } from 'dogsplayingpoker-shared/pet'
import { z } from 'zod'
import { useAuth } from '@/context/auth'

export const usePets = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['pets'],
    queryFn: () => api.get(z.array(petSchema), '/pets'),
    enabled: !!user,
  })
}

export const useCreatePet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['pets', 'create'],
    mutationFn: (input: CreatePetInput) => api.post(petSchema, '/pets', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
    },
  })
}

export const useEditPet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['pets', 'edit'],
    mutationFn: ({ id, input }: { id: number, input: CreatePetInput }) =>
      api.put(petSchema, `/pets/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
    },
  })
}
