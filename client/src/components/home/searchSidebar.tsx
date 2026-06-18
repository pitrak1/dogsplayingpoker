import { SearchBox } from '@mapbox/search-js-react'
import { SearchResults } from './searchResults'
import { SearchPagination } from './searchPagination'
import { User } from '@/types/user'
import mapboxgl from 'mapbox-gl'
import './searchSidebar.scss'

type Props = {
  users: User[] | null
  totalCount: number | null
  mapInstance: mapboxgl.Map | null
  searchValue: string
  currentPage: number
  onPageChange: (value: number) => void
  onSearchChange: (value: string) => void
  searchedLocation: string | null
  onSearchLocationChange: (value: string | null) => void
  onSearchResultHover: (userId: number | null) => void
}

export function SearchSidebar({
  users,
  totalCount,
  mapInstance,
  searchValue,
  currentPage,
  onPageChange,
  onSearchChange,
  searchedLocation,
  onSearchLocationChange,
  onSearchResultHover,
}: Props) {
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const map = mapInstance ?? undefined

  const labelText = searchedLocation ? `Searching near` : `Search for a location`
  const resultCountText = `${totalCount} total users in search area`

  const handleSearchSubmit = (result: any) => {
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
            onChange={onSearchChange}
            onRetrieve={handleSearchSubmit}
            options={{ language: 'en', country: 'US' }}
          />
        </div>
        <div className="search-sidebar__result-count">{resultCountText}</div>
      </div>
      <SearchResults users={users} onSearchResultHover={onSearchResultHover} />
      <SearchPagination pageNumber={currentPage} totalCount={totalCount} onPageChange={onPageChange} />
    </div>
  )
}
