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
  hasMapMoved: boolean
  onMapReady: (map: mapboxgl.Map) => void
  onMapMove: (map: mapboxgl.Map) => void
  onRedoSearch: () => void
  hoveredUserId: number | null
}

export function MapView({
  users,
  initialLat,
  initialLng,
  initialZoom,
  hasMapMoved,
  onMapReady,
  onMapMove,
  onRedoSearch,
  hoveredUserId
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef(new Map<number, mapboxgl.Marker>())
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
    if (hoveredUserId) {
      const marker = markersRef.current.get(hoveredUserId)
      marker?.getElement().classList.add('map-view__marker-avatar-highlighted')
    }

    return () => {
      if (hoveredUserId) {
        const marker = markersRef.current.get(hoveredUserId)
        marker?.getElement().classList.remove('map-view__marker-avatar-highlighted')
      }
    }
  }, [hoveredUserId])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current
    const sourceIds: string[] = []


    users.forEach((user) => {
      if (!user.longitude || !user.latitude || !user.radiusMiles) return
      const el = addUserMarker(map, user, () => navigate(`/profile/${user.username}`))
      markersRef.current.set(user.id, el)
      sourceIds.push(addUserRange(map, user))
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current.clear()
      if (!map.isStyleLoaded()) return
      sourceIds.forEach((id) => removeUserRange(map, id))
    }
  }, [mapLoaded, users, navigate])

  return (
    <div className="map-view__container">
      {hasMapMoved && <button className="map-view__search-in-map-button" onClick={onRedoSearch}>Redo search in map</button>}
      <div ref={mapContainerRef} className="map-view__map" />
    </div>
  )
}
