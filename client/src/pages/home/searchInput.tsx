import { SearchBox } from '@mapbox/search-js-react'
import type { MapboxSearchResult } from 'dogsplayingpoker-shared/common'
import mapboxgl from 'mapbox-gl'
import { useState } from 'react'
import './searchInput.scss'

type Props = {
  totalCount: number | null
  mapInstance?: mapboxgl.Map
  searchedLocation: string | null
  onSearchLocationChange: (value: string | null) => void
}

export function SearchInput({
  totalCount,
  mapInstance,
  searchedLocation,
  onSearchLocationChange,
}: Props) {
  const [searchValue, setSearchValue] = useState('')

  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

  const labelText = searchedLocation ? `Searching near` : `Search for a location`
  const resultCountText = `${totalCount} total users in search area`

  const handleSearchSubmit = (result: MapboxSearchResult) => {
    onSearchLocationChange(result.features[0].properties.name)
  }

  return (
    <div className="search-input">
        <h1 className="search-input__title">{labelText}</h1>
        {/* I don't like this extra div here but SearhBox renders another element which messes
        up the flex display with the gap */}
        <div>
          <SearchBox
            aria-labelledby="search-input__title"
            accessToken={accessToken}
            map={mapInstance}
            mapboxgl={mapboxgl}
            value={searchValue}
            onChange={setSearchValue}
            onRetrieve={handleSearchSubmit}
            options={{ language: 'en', country: 'US' }}
          />
        </div>
        <div className="search-input__total">{resultCountText}</div>
    </div>
  )
}
