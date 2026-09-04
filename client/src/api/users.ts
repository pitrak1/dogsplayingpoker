import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { ActiveSearch } from '@/pages/home/home'
import { authResponseSchema, EditUserInput, fullUserSchema, paginatedUsersSchema, publicPaginatedUsersSchema } from 'dogsplayingpoker-shared/user'
import { useAuth } from '@/context/auth'

export const useUserByUsername = (username: string) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => api.get(fullUserSchema, `/users/by-username/${username}`),
    enabled: !!user,
  })
}

export const useSearchUsers = (input: ActiveSearch | null) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['users', input, !!user],
    queryFn: () =>
      api.get(user ? paginatedUsersSchema : publicPaginatedUsersSchema, '/users/search', {
        swLat: String(input!.swLat),
        swLng: String(input!.swLng),
        neLat: String(input!.neLat),
        neLng: String(input!.neLng),
        centerLat: String(input!.centerLat),
        centerLng: String(input!.centerLng),
        page: String(input!.page),
      }),
    enabled: !!input
  })
}

export const useLogin = () =>
  useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (input: { email: string; password: string }) =>
      api.post(authResponseSchema, '/auth/login', input),
  })

export const useRegister = () =>
  useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: (input: { username: string; email: string; password: string }) =>
      api.post(authResponseSchema, '/auth/register', input),
  })

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['users', 'updateProfile'],
    mutationFn: (input: EditUserInput) =>
      api.patch(fullUserSchema, '/users/update-profile', input),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['user', user.username] })
    }
  })
}
