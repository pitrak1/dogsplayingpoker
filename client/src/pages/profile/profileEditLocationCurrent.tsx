import { useAuth } from '@/context/auth'
import { UserMap } from '@/components/userMap'
import { MapPin, Trash } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import './profileEditLocationCurrent.scss'

type Props = {
  isPending: boolean
  onClearClick: () => void
}

export function ProfileEditLocationCurrent({isPending, onClearClick}: Props) {
  const { user } = useAuth()
  const users = user ? [user] : []
  
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  
  const handleMapReady = useCallback(
      (map: mapboxgl.Map) => {
        setMapInstance(map)
      },
      []
    )

  useEffect(() => {
    if (!mapInstance || !user || !user.latitude || !user.longitude) return
    mapInstance.easeTo({ center: [user.longitude, user.latitude], duration: 1000 })
  }, [mapInstance, user])

  const hasCurrentLocation = user && user.latitude && user.longitude
  const clearButtonDisabled = !hasCurrentLocation || isPending
    
  return (
    <div className="profile-edit-location-current">
      <div className="profile-edit-location-current__header">
        <div className="profile-edit-location-current__text">
          <label className="settings-field-name">Your current location</label>
          <small className="settings-field-description">This is how your location appears to other users.</small>
        </div>
        <button 
          className="primary-button" 
          disabled={clearButtonDisabled} 
          onClick={onClearClick}
        >
          <Trash size={20} />
          <div className="button-text">Clear</div>
        </button>
      </div>
      <div className="profile-edit-location-current__map-container">
        <UserMap 
          users={users} 
          initialPosition={{ lat: user?.latitude, lng: user?.longitude, zoom: 10 }}
          isBlocked={!hasCurrentLocation}
          lockMovement={true}
          onMapReady={handleMapReady}
        >
          <MapPin size={26} />
          <div className="map-blocker-title">No location set yet</div>
          <div className="map-blocker-text">Add a location below so nearby members can discover you and your pets.</div>
        </UserMap>
      </div>
    </div>
  )
}
