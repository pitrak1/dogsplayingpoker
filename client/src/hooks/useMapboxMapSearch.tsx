import { useState } from 'react'
import { useSearchUsers } from '@/api/users'
import type { PaginationInput } from 'dogsplayingpoker-shared/common'
import { boundsFromMap } from '@/lib/maps'

type MapBounds = {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
  centerLat: number
  centerLng: number
}

export type ActiveSearch = MapBounds & PaginationInput

export const useMapboxMapSearch = () => {
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | null>(null)

  const { data } = useSearchUsers(activeSearch)
  const users = data?.users ?? []
  const totalCount = data?.totalCount ?? 0
  const currentPage = activeSearch ? Number(activeSearch.page) : 1

  const setSearchToMap = (map: mapboxgl.Map) => {
    const initial = boundsFromMap(map)
    setActiveSearch({ ...initial, page: 1 })
  }

  const setSearchPage = (page: number) => {
    setActiveSearch((prev) => prev ? { ...prev, page } : null)
  }

  return {
    users,
    totalCount,
    currentPage,
    activeSearch,
    setSearchToMap,
    setSearchPage
  }
}
