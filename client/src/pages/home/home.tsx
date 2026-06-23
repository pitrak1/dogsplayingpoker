import { UserMap } from '@/components/userMap'
import { SearchSidebar } from '@/pages/home/searchSidebar'
import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { useSearchUsers } from '@/api/users'
import { boundsFromMap } from '@/lib/maps'
import { User } from '@/types/user'
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
  const [searchUrlParams, setSearchUrlParams] = useSearchParams()
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [searchedLocationName, setSearchedLocationName] = useState<string | null>(null)
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | null>(null)
  const [highlightedUser, setHighlightedUser] = useState<User | null>(null)
  const [hasMapMoved, setHasMapMoved] = useState<boolean>(false)
  const [searchOnNextMove, setSearchOnNextMove] = useState<boolean>(false)

  const navigate = useNavigate()

  const lat = parseFloat(searchUrlParams.get('lat') ?? DEFAULT_MAP_CENTER.latitude.toString())
  const lng = parseFloat(searchUrlParams.get('lng') ?? DEFAULT_MAP_CENTER.longitude.toString())
  const zoom = parseFloat(searchUrlParams.get('zoom') ?? DEFAULT_MAP_CENTER.zoom.toString())

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

  const currentPage = activeSearch ? Number(activeSearch?.page) : 1

  const { data } = useSearchUsers(activeSearch)
  const users = data?.users ?? []
  const totalCount = data?.totalCount ?? 0

  const handleRedoSearch = () => {
    if (!mapInstance) return 
    const next = boundsFromMap(mapInstance)
    const zoom = mapInstance.getZoom()
    setSearchUrlParams(
      {
        lat: Number(next.centerLat).toFixed(6),
        lng: Number(next.centerLng).toFixed(6),
        zoom: zoom.toFixed(2),
      },
      { replace: true },
    )
    setActiveSearch({ ...next, page: 1 })
    setHasMapMoved(false)
  }

  const handleClickMarker = useCallback((user: User) => {
    navigate(`/profile/${user.username}`)
  }, [navigate])

  const handleMapMove = useCallback(() => {
    if (!mapInstance) return

    if (searchOnNextMove) {
      setActiveSearch({ ...boundsFromMap(mapInstance), page: 1 })
      setSearchOnNextMove(false)
    } else {
      setHasMapMoved(true)
    }
  }, [searchOnNextMove, mapInstance])

  const handleSearchLocationChange = (location: string | null) => {
    setSearchedLocationName(location)
    if (location) setSearchOnNextMove(true)
  }

  return (
    <div className="home">
      <div className="home__map-container">
        {hasMapMoved && <button className="home__redo-search-button" onClick={handleRedoSearch}>Redo search in map</button>}
        <UserMap
          users={users ?? []}
          highlightedUser={highlightedUser}
          initialPosition={{ lat, lng, zoom }}
          onMapReady={handleMapReady}
          onMapMove={handleMapMove}
          onClickMarker={handleClickMarker}
          onRedoSearch={handleRedoSearch}
          onHoverMarker={setHighlightedUser}
        />
      </div>
      <SearchSidebar
        users={users ?? []}
        highlightedUser={highlightedUser}
        totalCount={totalCount}
        mapInstance={mapInstance}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        searchedLocation={searchedLocationName}
        onSearchLocationChange={handleSearchLocationChange}
        onSearchResultHover={setHighlightedUser}
      />
    </div>
  )
}
