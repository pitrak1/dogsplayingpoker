import { useAuth } from '@/context/auth'
import { UserMap } from '@/components/userMap'
import { Shuffle } from 'lucide-react'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { MapBlocker } from '@/components/mapBlocker'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import './profileEditLocationDistance.scss'
import { FullUser } from 'dogsplayingpoker-shared/user'

type Props = {
  generatedCoordinates: mapboxgl.LngLat | null
  distance: number
  onDistanceChange: (value: number) => void
}

export function ProfileEditLocationDistance({generatedCoordinates, distance, onDistanceChange}: Props) {
  const { user } = useAuth()
  const [highlightedUser, setHighlightedUser] = useState<FullUser | null>(null)
  
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

  const userWithGeneratedValues = useMemo(() =>
    (generatedCoordinates && distance != null && user) ? {
      ...user,
      location: { x: generatedCoordinates.lng, y: generatedCoordinates.lat },
      radiusMiles: distance
    } : null,
    [generatedCoordinates, distance, user]
  )

  const userAtLocationAsArray = useMemo(() =>
    userWithGeneratedValues ? [userWithGeneratedValues] : [],
    [userWithGeneratedValues]
  )

  return (
    <div className="profile-edit-location-distance">
      <div className="profile-edit-location-distance__header">
        <div className="profile-edit-location-distance__text">
          <label className="profile-edit-location-distance__title">Privacy range</label>
          <span className="profile-edit-location-distance__description">Other users see your location as a point within this distance of the location given above.</span>
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
      <div className="profile-edit-location-distance__map-container">
        <UserMap 
          initialPosition={DEFAULT_MAP_CENTER}
          users={userAtLocationAsArray}
          highlightedUser={highlightedUser}
          isBlocked={!generatedCoordinates}
          lockMovement={true}
          onMapReady={handleMapReady}
          onHoverMarker={setHighlightedUser}
        >
          <MapBlocker>
            <Shuffle size={26} />
            <MapBlocker.Title>Generate a location to preview</MapBlocker.Title>
          </MapBlocker>
        </UserMap>
      </div>
    </div>
  )
}
