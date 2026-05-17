import { SearchBox } from '@mapbox/search-js-react'
import mapboxgl from 'mapbox-gl'
import './searchSidebar.scss'
import { SearchResults } from './searchResults'

type Props = {
    mapInstance: mapboxgl.Map | null
    searchValue: string
    onSearchChange: (value: string) => void
    searchedLocation: string | null
    onSearchLocationChange: (value: string | null) => void
}

export function SearchSidebar({ mapInstance, searchValue, onSearchChange, searchedLocation, onSearchLocationChange }: Props) {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    const map = mapInstance ?? undefined

    const labelText = searchedLocation ? `Searching near` : `Search for a location`
    const resultCountText = searchedLocation ? `Number users shown` : `See how many users are shown here`

    const handleSearchSubmit = (result: any) => {
        onSearchLocationChange(result.features[0].properties.name)
    }

    return (
        <div className="search-sidebar__container">
            <div className="search-sidebar__header">
                <h2 className="search-sidebar__input-label">
                    {labelText}
                </h2>
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
                <div className="search-sidebar__result-count">
                    {resultCountText}
                </div>
                <hr className="search-sidebar__divider" />
            </div>
            <SearchResults users={[]} pageNumber={1} onPageChange={() => { }} />
        </div>
    )
}
