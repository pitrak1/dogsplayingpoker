import { useAuth } from '@/context/auth'
import { UserMap } from '@/components/userMap'
import { Shuffle } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import './profileEditLocationDistance.scss'

type Props = {
  generatedCoordinates: mapboxgl.LngLat | null
  distance: number
  onDistanceChange: (value: number) => void
}

export function ProfileEditLocationDistance({generatedCoordinates, distance, onDistanceChange}: Props) {
  const { user } = useAuth()
  
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)

  const handleMapReady = useCallback(
    (map: mapboxgl.Map) => {
      setMapInstance(map)
    },
    []
  )

  useEffect(() => {
    if (!mapInstance || !generatedCoordinates) return
    mapInstance.easeTo({ center: [generatedCoordinates.lng, generatedCoordinates.lat], duration: 1000 })
  }, [mapInstance, generatedCoordinates])

  const userAtLocationAsArray = (generatedCoordinates && distance != null && user) ? [{
    ...user,
    latitude: generatedCoordinates.lat,
    longitude: generatedCoordinates.lng,
    radiusMiles: distance
  }] : []

  return (
    <div className="profile-edit-location-distance">
      <div className="profile-edit-location-distance__header">
        <div className="profile-edit-location-distance__text">
          <label className="settings-field-name">Privacy range</label>
          <small className="settings-field-description">Other users see your location as a point within this distance of the location given above.</small>
        </div>
        <div className="profile-edit-location-distance__distance-display">{distance} miles</div>
      </div>
      <input
        className="profile-edit-location-distance__distance-input"
        type="range" 
        min="0" 
        max="25" 
        value={distance} 
        onChange={(e) => onDistanceChange(Number(e.target.value))} 
      />
      <div className="profile-edit-location-current__map-container">
        <UserMap 
          users={userAtLocationAsArray} 
          isBlocked={!generatedCoordinates}
          lockMovement={true}
          onMapReady={handleMapReady}
        >
          <Shuffle size={26} />
          <div className="map-blocker-title">Generate a location to preview</div>
        </UserMap>
      </div>
    </div>
  )
}
