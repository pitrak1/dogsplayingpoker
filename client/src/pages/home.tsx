import { UserMap } from '@/components/userMap'
import { SearchSidebar } from '@/components/home/searchSidebar'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { useSearchUsers } from '@/api/users'
import { boundsFromMap } from '@/lib/maps'
import 'mapbox-gl/dist/mapbox-gl.css'
import './home.scss'

type MapBounds = {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
  centerLat: number
  centerLng: number
}

export type ActiveSearch = MapBounds & { page: number }

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [searchedLocation, setSearchedLocationChange] = useState<string | null>(null)
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | null>(null)
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null)

  const lat = parseFloat(searchParams.get('lat') ?? DEFAULT_MAP_CENTER.latitude.toString())
  const lng = parseFloat(searchParams.get('lng') ?? DEFAULT_MAP_CENTER.longitude.toString())
  const zoom = parseFloat(searchParams.get('zoom') ?? DEFAULT_MAP_CENTER.zoom.toString())

  const handleMapReady = useCallback(
    (map: mapboxgl.Map) => {
      setMapInstance(map)
      const initial = boundsFromMap(map)
      setActiveSearch({ ...initial, page: 1 })
    },
    []
  )

  const handlePageChange = (page: number) => {
    setActiveSearch((prev) => prev ? { ...prev, page } : prev)
  }

  const currentPage = Number(activeSearch?.page) ?? 1

  const { data } = useSearchUsers(activeSearch)
  const users = data?.users ?? []
  const totalCount = data?.totalCount ?? 0

  const handleRedoSearch = () => {
    if (!mapInstance) return 
    const next = boundsFromMap(mapInstance)
    const zoom = mapInstance.getZoom()
    setSearchParams(
      {
        lat: Number(next.centerLat).toFixed(6),
        lng: Number(next.centerLng).toFixed(6),
        zoom: zoom.toFixed(2),
      },
      { replace: true },
    )
    setActiveSearch({ ...next, page: 1 })
  }

  return (
    <div className="home">
      <div className="home__map-container">
        <UserMap
          users={users ?? []}
          hoveredUserIds={hoveredUserId ? [hoveredUserId] : []}
          initialPosition={{ lat, lng, zoom }}
          onMapReady={handleMapReady}
          onRedoSearch={handleRedoSearch}
        />
      </div>
      <SearchSidebar
        users={users ?? []}
        totalCount={totalCount}
        mapInstance={mapInstance}
        searchValue={searchValue}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearchChange={setSearchValue}
        searchedLocation={searchedLocation}
        onSearchLocationChange={setSearchedLocationChange}
        onSearchResultHover={setHoveredUserId}
      />
    </div>
  )
}
