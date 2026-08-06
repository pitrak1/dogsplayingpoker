import { UserMap } from '@/components/userMap'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchUsers } from '@/api/users'
import { boundsFromMap } from '@/lib/maps'
import type { FullUser as User } from 'dogsplayingpoker-shared/user'
import type { PaginationInput } from 'dogsplayingpoker-shared/common'
import { SearchInput } from './searchInput'
import { SearchResults } from './searchResults'
import { Pagination } from '@/components/pagination'
import { Divider } from '@mantine/core'
import 'mapbox-gl/dist/mapbox-gl.css'
import './home.scss'
import { useCoordinateParams } from '@/hooks/useCoordinateParams'
import { DEFAULT_MAP_CENTER } from '@/constants/map'

type MapBounds = {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
  centerLat: number
  centerLng: number
}

export type ActiveSearch = MapBounds & PaginationInput

export function Home() {
  const { mapPosition, setParams } = useCoordinateParams(DEFAULT_MAP_CENTER)
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map>()
  const [searchedLocationName, setSearchedLocationName] = useState<string | null>(null)
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | null>(null)
  const [highlightedUser, setHighlightedUser] = useState<User | null>(null)
  const [hasMapMoved, setHasMapMoved] = useState<boolean>(false)
  const [searchOnNextMove, setSearchOnNextMove] = useState<boolean>(false)

  const navigate = useNavigate()
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
    setParams(next.centerLat, next.centerLng, zoom)
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
    // This is done because if we immediately search at the map location, we will be searching before the map moves to `location`
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
          initialPosition={mapPosition}
          onMapReady={handleMapReady}
          onMapMove={handleMapMove}
          onClickMarker={handleClickMarker}
          onRedoSearch={handleRedoSearch}
          onHoverMarker={setHighlightedUser}
        />
      </div>
      <div className="home__sidebar">
        <SearchInput 
          totalCount={totalCount} 
          mapInstance={mapInstance} 
          searchedLocation={searchedLocationName} 
          onSearchLocationChange={handleSearchLocationChange} 
        />
        <Divider />
        <SearchResults 
          users={users} 
          highlightedUser={highlightedUser} 
          onSearchResultHover={setHighlightedUser} 
        />
        <Divider />
        <Pagination 
          pageNumber={currentPage} 
          pageSize={25} 
          totalCount={totalCount ?? 0} 
          onPageChange={handlePageChange} 
          className={"home__search-pagination"}
        />
      </div>
    </div>
  )
}
