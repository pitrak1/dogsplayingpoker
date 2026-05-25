import { useMutation, useQuery } from '@tanstack/react-query'
import { rpc } from './rpc'
import type { InferRequestType } from 'hono/client'
import type { ActiveSearch } from '@/pages/home'

type SearchUsersInput = InferRequestType<typeof rpc.api.users.search.$get>['query']

export const useUserByUsername = (username: string) =>
  useQuery({
    queryKey: ['user', 'by-username', username],
    queryFn: async () => {
      const res = await rpc.api.users['by-username'][':username'].$get({ param: { username } })
      if (!res.ok) throw new Error('Failed to fetch user')
      return res.json()
    },
    enabled: !!username,
  })

export const useSearchUsers = (input: ActiveSearch | null) =>
  useQuery({
    queryKey: ['users', 'search', input],
    queryFn: async () => {
      const res = await rpc.api.users.search.$get({
        query: {
          swLat: String(input!.swLat),
          swLng: String(input!.swLng),
          neLat: String(input!.neLat),
          neLng: String(input!.neLng),
          centerLat: String(input!.centerLat),
          centerLng: String(input!.centerLng),
          page: String(input!.page),
        },
      })
      if (!res.ok) throw new Error('Failed to search users')
      return res.json()
    },
    enabled: !!input
  })

export const useLogin = () =>
  useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await rpc.api.auth.login.$post({ json: input })
      if (!res.ok) throw new Error((await res.json()).message ?? 'Login failed')
      return res.json()
    },
  })

export const useRegister = () =>
  useMutation({
    mutationFn: async (input: { username: string; email: string; password: string }) => {
      const res = await rpc.api.auth.register.$post({ json: input })
      if (!res.ok) throw new Error((await res.json()).message ?? 'Signup failed')
      return res.json()
    },
  })

