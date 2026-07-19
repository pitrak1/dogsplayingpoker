import { useState, useCallback } from 'react'
import { UserMap } from '@/components/userMap'
import { SearchBox } from '@mapbox/search-js-react'
import { useAuth } from '@/context/auth'
import { MapboxSearchResult } from 'dogsplayingpoker-shared/common'
import { MapBlocker } from '@/components/mapBlocker'
import './profileEditLocationNew.scss'

type Props = {
  coordinates: mapboxgl.LngLat | null
  onSearchSubmit: (lat: number, lng: number) => void
}

export function ProfileEditLocationNew({coordinates, onSearchSubmit}: Props) {
  const { user } = useAuth()

  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [location, setLocation] = useState('')

  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

  const handleMapReady = useCallback(
    (map: mapboxgl.Map) => {
      setMapInstance(map)
    },
    []
  )

  const handleSearchSubmit = (result: MapboxSearchResult) => {
    if (!user || !mapInstance) return
    const [lng, lat] = result.features[0].geometry.coordinates
    mapInstance.easeTo({ center: [lng, lat], duration: 1000 })
    onSearchSubmit(lat, lng)
  }

  const userAtLocationAsArray = (user && coordinates) ? [{
    ...user,
    latitude: coordinates.lat,
    longitude: coordinates.lng,
    radiusMiles: 0
  }] : []
  
  return (
    <div className="profile-edit-location-new">
      <div className="profile-edit-location-new__header">
        <label 
          id="location-search-box-label" 
          className="profile-edit-location-new__title"
        >
          Enter a new location
        </label>
        <small className="profile-edit-location-new__description">This location will be obscured using the distance range entered below.</small>
        <div className="profile-edit-location-new__searchbox-container">
          <SearchBox
            aria-labelledby="location-search-box-label"
            accessToken={accessToken}
            value={location}
            onChange={setLocation}
            onRetrieve={handleSearchSubmit}
            options={{ language: 'en', country: 'US' }}
          />
        </div>
      </div>
      <div className="profile-edit-location-new__map-container">
        <UserMap 
          users={userAtLocationAsArray} 
          lockMovement={true}
          isBlocked={!coordinates} 
          onMapReady={handleMapReady}
        >
          <MapBlocker>
            <MapBlocker.Title>Search above to select a location</MapBlocker.Title>
          </MapBlocker>
        </UserMap>
      </div>
    </div>
  )
}
