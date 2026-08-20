import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { CreatePetInput, petSchema } from 'dogsplayingpoker-shared/pet'
import { z } from 'zod'
import { useAuth } from '@/context/auth'

export const usePets = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const res = await api.get('/pets')
      if (!res.ok) throw new Error('Failed to fetch pets')
      return z.array(petSchema).parse(await res.json())
    },
    enabled: !!user,
  })
}

export const useCreatePet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreatePetInput) => {
      const res = await api.post('/pets', input)
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to create pet')
      return petSchema.parse(await res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
    },
  })
}

export const useEditPet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: number, input: CreatePetInput }) => {
      const res = await api.put(`/pets/${id}`, input)
      if (!res.ok) throw new Error((await res.json()).toString() ?? 'Failed to edit pet')
      return petSchema.parse(await res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
    },
  })
}
