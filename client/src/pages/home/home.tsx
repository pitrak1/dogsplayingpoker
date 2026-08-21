import { UserMap } from '@/components/userMap'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import type { FullUser } from 'dogsplayingpoker-shared/user'
import type { PaginationInput } from 'dogsplayingpoker-shared/common'
import { SearchInput } from './searchInput'
import { SearchResults } from './searchResults'
import { Pagination } from '@/components/pagination'
import { Divider } from '@mantine/core'
import 'mapbox-gl/dist/mapbox-gl.css'
import './home.scss'
import { useCoordinateParams } from '@/hooks/useCoordinateParams'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { useMapboxMapSearch } from '@/hooks/useMapboxMapSearch'

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
  const { mapPosition, setParamsFromMap } = useCoordinateParams(DEFAULT_MAP_CENTER)
  const { 
    users,
    totalCount,
    currentPage,
    setSearchToMap, 
    setSearchPage 
  } = useMapboxMapSearch()
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map>()
  const [highlightedUser, setHighlightedUser] = useState<FullUser | null>(null)
  const [hasMapMoved, setHasMapMoved] = useState<boolean>(false)
  const [searchOnNextMove, setSearchOnNextMove] = useState<boolean>(false)
  const [searchLocationName, setSearchLocationName] = useState<string | null>(null)

  const navigate = useNavigate()
  const handleMapReady = useCallback(
    (map: mapboxgl.Map) => {
      setMapInstance(map)
      setSearchToMap(map)
    },
    [setSearchToMap]
  )

  const handleRedoSearch = useCallback(() => {
    if (!mapInstance) return 
    setParamsFromMap(mapInstance)
    setSearchToMap(mapInstance)
    setHasMapMoved(false)
  }, [mapInstance, setParamsFromMap, setSearchToMap, setHasMapMoved])

  const handleClickMarker = useCallback((user: FullUser) => {
    navigate(`/profile/${user.username}`)
  }, [navigate])

  const handleMapMove = useCallback(() => {
    if (!mapInstance) return

    setParamsFromMap(mapInstance)

    if (searchOnNextMove) {
      setSearchToMap(mapInstance)
      setSearchOnNextMove(false)
    } else {
      setHasMapMoved(true)
    }
  }, [setParamsFromMap, setSearchToMap, searchOnNextMove, mapInstance, setHasMapMoved])

  const handleSearchLocationChange = (location: string | null) => {
    // This is done because if we immediately search at the map location, we will be searching before the map moves to `location`
    setSearchLocationName(location)
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
          onHoverMarker={setHighlightedUser}
        />
      </div>
      <div className="home__sidebar">
        <SearchInput 
          totalCount={totalCount} 
          mapInstance={mapInstance} 
          searchedLocation={searchLocationName} 
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
          onPageChange={setSearchPage} 
          className={"home__search-pagination"}
        />
      </div>
    </div>
  )
}
