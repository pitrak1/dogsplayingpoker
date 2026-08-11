import { useAuth } from '@/context/auth'
import { UserMap } from '@/components/userMap'
import { MapPin, Trash } from 'lucide-react'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { MapBlocker } from '@/components/mapBlocker'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import './profileEditLocationCurrent.scss'
import { FullUser } from 'dogsplayingpoker-shared/user'
import { Button } from '@mantine/core'

type Props = {
  isPending: boolean
  onClearClick: () => void
}

export function ProfileEditLocationCurrent({isPending, onClearClick}: Props) {
  const { user } = useAuth()
  const users = useMemo(() => user ? [user] : [], [user])
  const [highlightedUser, setHighlightedUser] = useState<FullUser | null>(null)
  
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  
  const handleMapReady = useCallback(
    (map: mapboxgl.Map) => {
      setMapInstance(map)
    },
    []
  )

  useEffect(() => {
    if (!mapInstance || !user || !user.location) return
    mapInstance.easeTo({ center: [user.location.x, user.location.y], duration: 1000 })
  }, [mapInstance, user])

  const hasCurrentLocation = user && user.location
  const clearButtonDisabled = !hasCurrentLocation || isPending

  const getInitialPosition = () => {
    if (user && user.location) {
      return { lat: user.location.y, lng: user?.location.x, zoom: 10 }
    } else {
      return DEFAULT_MAP_CENTER
    }
  }

  return (
    <div className="profile-edit-location-current">
      <div className="profile-edit-location-current__header">
        <div className="profile-edit-location-current__text">
          <label className="profile-edit-location-current__title">Your current location</label>
          <span className="profile-edit-location-current__description">This is how your location appears to other users.</span>
        </div>
        <Button
          size="lg"
          disabled={clearButtonDisabled} 
          onClick={onClearClick}
          leftSection={<Trash size={20} />}
        >
          Clear
        </Button>
      </div>
      <div className="profile-edit-location-current__map-container">
        <UserMap 
          users={users} 
          initialPosition={getInitialPosition()}
          isBlocked={!hasCurrentLocation}
          lockMovement={true}
          onMapReady={handleMapReady}
          highlightedUser={highlightedUser}
          onHoverMarker={setHighlightedUser}
        >
          <MapBlocker>
            <MapPin size={26} />
            <MapBlocker.Title>No location set yet</MapBlocker.Title>
            <MapBlocker.Description>Add a location below so nearby members can discover you and your pets.</MapBlocker.Description>
          </MapBlocker>
        </UserMap>
      </div>
    </div>
  )
}
