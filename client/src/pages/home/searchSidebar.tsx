import { SearchBox } from '@mapbox/search-js-react'
import { SearchResults } from './searchResults'
import { Pagination } from '@/components/pagination'
import type { UserWithPets as User } from 'dogsplayingpoker-shared/user'
import type { MapboxSearchResult } from 'dogsplayingpoker-shared/common'
import mapboxgl from 'mapbox-gl'
import { useState } from 'react'
import './searchSidebar.scss'

type Props = {
  users: User[] | null
  highlightedUser?: User | null
  totalCount: number | null
  mapInstance: mapboxgl.Map | null
  currentPage: number
  onPageChange: (value: number) => void
  searchedLocation: string | null
  onSearchLocationChange: (value: string | null) => void
  onSearchResultHover: (userId: number | null) => void
}

export function SearchSidebar({
  users,
  highlightedUser,
  totalCount,
  mapInstance,
  currentPage,
  onPageChange,
  searchedLocation,
  onSearchLocationChange,
  onSearchResultHover,
}: Props) {
  const [searchValue, setSearchValue] = useState('')

  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const map = mapInstance ?? undefined

  const labelText = searchedLocation ? `Searching near` : `Search for a location`
  const resultCountText = `${totalCount} total users in search area`

  const handleSearchSubmit = (result: MapboxSearchResult) => {
    onSearchLocationChange(result.features[0].properties.name)
  }

  return (
    <div className="search-sidebar__container">
      <div className="search-sidebar__header">
        <h2 className="search-sidebar__input-label">{labelText}</h2>
        <div className="search-sidebar__input-container">
          <SearchBox
            aria-labelledby="search-map__search-box-label"
            accessToken={accessToken}
            map={map}
            mapboxgl={mapboxgl}
            value={searchValue}
            onChange={setSearchValue}
            onRetrieve={handleSearchSubmit}
            options={{ language: 'en', country: 'US' }}
          />
        </div>
        <div className="search-sidebar__result-count">{resultCountText}</div>
      </div>
      <SearchResults users={users} highlightedUser={highlightedUser} onSearchResultHover={onSearchResultHover} />
      <Pagination pageNumber={currentPage} pageSize={25} totalCount={totalCount ?? 0} onPageChange={onPageChange} className={"search-sidebar__pagination"}/>
    </div>
  )
}
