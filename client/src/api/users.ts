import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { ActiveSearch } from '@/pages/home/home'
import { ApiError } from './errors'
import { authResponseSchema, EditUserInput, fullUserSchema, userPaginationResponseSchema } from 'dogsplayingpoker-shared/user'
import { useAuth } from '@/context/auth'

export const useUserByUsername = (username: string) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const res = await api.get(`/users/by-username/${username}`)
      if (!res.ok) throw new Error('Failed to fetch user')
      return fullUserSchema.parse(await res.json())
    },
    enabled: !!user,
  })
}

export const useSearchUsers = (input: ActiveSearch | null) =>
  useQuery({
    queryKey: ['users', input],
    queryFn: async () => {
      const res = await api.get('/users/search', {
        swLat: String(input!.swLat),
        swLng: String(input!.swLng),
        neLat: String(input!.neLat),
        neLng: String(input!.neLng),
        centerLat: String(input!.centerLat),
        centerLng: String(input!.centerLng),
        page: String(input!.page),
      })
      if (!res.ok) throw new Error('Failed to search users')
      return userPaginationResponseSchema.parse(await res.json())
    },
    enabled: !!input
  })

export const useLogin = () =>
  useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await api.post('/auth/login', input)
      if (!res.ok) {
        const body = (await res.json()) as { message: string; field?: string }
        throw new ApiError(body.message ?? 'Login failed', body.field)
      }
      return authResponseSchema.parse(await res.json())
    },
  })

export const useRegister = () =>
  useMutation({
    mutationFn: async (input: { username: string; email: string; password: string }) => {
      const res = await api.post('/auth/register', input)
      if (!res.ok) {
        const body = (await res.json()) as { message: string; field?: string }
        throw new ApiError(body.message ?? 'Signup failed', body.field)
      }
      return authResponseSchema.parse(await res.json())
    },
  })

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: EditUserInput) => {
      const res = await api.patch('/users/update-profile', input)
      if (!res.ok) {
        const body = (await res.json()) as { message: string; field?: string }
        throw new ApiError(body.message ?? 'Update profile failed', body.field)
      }
      return fullUserSchema.parse(await res.json())
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['user', user.username] })
    }
  })
}
