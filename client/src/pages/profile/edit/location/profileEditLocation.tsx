import { useState } from 'react'
import { randomPointWithin } from '@/lib/maps'
import { setAuthUser } from '@/context/auth'
import { LngLat } from 'mapbox-gl'
import { useUpdateProfile } from '@/api/users'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import './profileEditLocation.scss'
import { ProfileEditLocationCurrent } from './profileEditLocationCurrent'
import { ProfileEditLocationNew } from './profileEditLocationNew'
import { ProfileEditLocationDistance } from './profileEditLocationDistance'
import { Shuffle, Save } from 'lucide-react'

export function ProfileEditLocation() {
  const [coordinates, setCoordinates] = useState<mapboxgl.LngLat | null>(null)
  const [distance, setDistance] = useState<number>(0)
  const [generatedCoordinates, setGeneratedCoordinates] = useState<mapboxgl.LngLat | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile()

  const handleSearchSubmit = (lat: number, lng: number) => {
    setCoordinates(new LngLat(lng, lat))
  }

  const handleClearClick = async () => {
    try {
      const updatedUser = await updateProfile({ latitude: null, longitude: null, radiusMiles: null })
      setAuthUser(updatedUser)
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  const handleGenerateClick = () => {
    if (!coordinates || distance == null) return
    const obscuredCoords = randomPointWithin(coordinates.lat, coordinates.lng, distance)
    setGeneratedCoordinates(new LngLat(obscuredCoords.lng, obscuredCoords.lat))
  }

  const handleSaveClick = async () => {
    if (!generatedCoordinates || distance == null) return
    try {
      const updatedUser = await updateProfile({ 
        latitude: generatedCoordinates.lat, 
        longitude: generatedCoordinates.lng, 
        radiusMiles: distance 
      })
      setAuthUser(updatedUser)
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  const isGenerateDisabled = !coordinates || distance == null || isPending
  const isSaveDisabled = !generatedCoordinates || distance == null || isPending

  return (
    <div className="profile-edit-location">
      <ErrorBanner message={formError} />
      <ProfileEditLocationCurrent 
        isPending={isPending} 
        onClearClick={handleClearClick}
      />
      <div className="profile-edit-location__change-location">
        <ProfileEditLocationNew 
          coordinates={coordinates} 
          onSearchSubmit={handleSearchSubmit} 
        />
        <ProfileEditLocationDistance 
          generatedCoordinates={generatedCoordinates} 
          distance={distance}
          onDistanceChange={setDistance}
        />
        <div className="profile-edit-location__buttons">
          <button 
            className="primary-button" 
            disabled={isGenerateDisabled} 
            onClick={handleGenerateClick}
          >
            <Shuffle size={20} />
            <div className="button-text">Generate</div>
          </button>
          <button 
            className="primary-button"  
            disabled={isSaveDisabled} 
            onClick={handleSaveClick}
          >
            <Save size={20} />
            <div className="button-text">Save</div>
          </button>
        </div>
      </div>
      
    </div>
  )
}
