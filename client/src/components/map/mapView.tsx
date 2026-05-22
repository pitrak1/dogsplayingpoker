import { User } from '@/types/user'
import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useMapboxMap } from '@/hooks/useMapboxMap'
import { addUserMarker, addUserRange, removeUserRange } from '@/lib/maps'
import './mapView.scss'

type Props = {
  users: User[]
  initialLat: number
  initialLng: number
  initialZoom: number
  onMapReady: (map: mapboxgl.Map) => void
  onMapMove: (lat: number, lng: number, zoom: number) => void
}

export function MapView({ users, initialLat, initialLng, initialZoom, onMapReady, onMapMove }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const { mapRef, mapLoaded } = useMapboxMap({
    container: mapContainerRef,
    initialLat,
    initialLng,
    initialZoom,
    onMapReady,
    onMapMove,
  })

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current
    const sourceIds: string[] = []
    const markers: mapboxgl.Marker[] = []

    users.forEach((user) => {
      if (!user.longitude || !user.latitude || !user.radiusMiles) return
      markers.push(addUserMarker(map, user, () => navigate(`/profile/${user.username}`)))
      sourceIds.push(addUserRange(map, user))
    })

    return () => {
      markers.forEach((m) => m.remove())
      if (!map.isStyleLoaded()) return
      sourceIds.forEach((id) => removeUserRange(map, id))
    }
  }, [mapLoaded, users, navigate])

  return (
    <div className="map-view__container">
      <div ref={mapContainerRef} className="map-view__map" />
    </div>
  )
}
