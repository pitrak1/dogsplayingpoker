import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { CreatePetInput, Pet } from 'dogsplayingpoker-shared/pet'
import { useAuth } from '@/context/auth'

export const usePets = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const res = await api.get('/pets')
      if (!res.ok) throw new Error('Failed to fetch pets')
      return res.json() as Promise<Pet[]>
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
      return res.json() as Promise<Pet>
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
      return res.json() as Promise<Pet>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
    },
  })
}
