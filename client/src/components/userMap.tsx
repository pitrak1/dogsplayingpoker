import { useRef, useCallback, useEffect, useState } from 'react'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { useMapboxMap } from '@/hooks/useMapboxMap'
import { User } from '@/types/user'
import { addUserMarker, addUserRange, removeUserRange } from '@/lib/maps'
import './userMap.scss'

type MapProps = {
  users: User[] | User
  highlightedUserId?: number | null
  initialPosition?: { lat: number, lng: number, zoom: number }
  caption?: string
  /* If you lock movement and do not provide an onScroll/onDoubleClick, zooming is centered */
  lockMovement?: boolean
  isBlocked?: boolean
  onMapReady?: (map: mapboxgl.Map) => void
  onMapMove?: (map: mapboxgl.Map) => void
  onScroll?: (map: mapboxgl.Map, e: WheelEvent) => void
  onDoubleClick?: (map: mapboxgl.Map, e: MouseEvent) => void
  onClickMarker?: (user: User) => void
  onHoverMarker?: (userId: number | null) => void
  onRedoSearch?: () => void
  children?: React.ReactNode
}

export function UserMap({ 
  users, 
  highlightedUserId, 
  initialPosition,
  lockMovement,
  isBlocked,
  onMapReady, 
  onMapMove,
  onScroll,
  onDoubleClick,
  onClickMarker,
  onHoverMarker,
  children
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  
  const markersRef = useRef(new Map<number, mapboxgl.Marker>())
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null)

  const handleMapMove = useCallback(
    (map: mapboxgl.Map) => {
      if (onMapMove) onMapMove(map)
    },
    [onMapMove]
  )

  const initialLat = initialPosition?.lat || DEFAULT_MAP_CENTER.latitude
  const initialLng = initialPosition?.lng || DEFAULT_MAP_CENTER.longitude
  const initialZoom = initialPosition?.zoom || DEFAULT_MAP_CENTER.zoom
  const mapReadyStub = () => {}
  const mapReadyCallback = onMapReady ?? mapReadyStub
  
  const { mapRef, mapLoaded } = useMapboxMap({
    container: mapContainerRef,
    initialLat,
    initialLng,
    initialZoom,
    lockMovement,
    onMapReady: mapReadyCallback,
    onMapMove: handleMapMove,
    onScroll,
    onDoubleClick,
  })

  const handleHoverMarker = useCallback((user: User | null) => {
    if (onHoverMarker) {
      onHoverMarker(user?.id)
    } else {
    }
  }, [onHoverMarker])

  useEffect(() => {
    if (!hoveredUserId) return
    const markers = markersRef.current
    const marker = markers.get(hoveredUserId)
    marker?.getElement().classList.add('user-map__marker-avatar-highlighted')

    return () => {
      if (!hoveredUserId) return
      const marker = markers.get(hoveredUserId)
      marker?.getElement().classList.remove('user-map__marker-avatar-highlighted')
    }
  }, [hoveredUserId])

  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current!
    const markers = markersRef.current
    const sourceIds: string[] = []

    const addMarker = (u: User) => {
      if (!u.longitude || !u.latitude) return
      const el = addUserMarker(map, u, () => onClickMarker && onClickMarker(u), handleHoverMarker)
      markers.set(u.id, el)

      if (!u.radiusMiles || u.radiusMiles == 0) return
      sourceIds.push(addUserRange(map, u))
    }

    if (Array.isArray(users)) {
      users.forEach(addMarker)
    } else {
      addMarker(users)
    }

    return () => {
      markers.forEach((m) => m.remove())
      markers.clear()
      sourceIds.forEach((id) => removeUserRange(map, id))
    }
  }, [mapRef, mapLoaded, users, onClickMarker, handleHoverMarker])

  useEffect(() => {
    const markers = markersRef.current
    
    if (highlightedUserId) {
        const marker = markers.get(highlightedUserId)
        marker?.getElement().classList.add('user-map__marker-avatar-highlighted')
    }

    return () => {
      if (highlightedUserId) {
        const marker = markers.get(highlightedUserId)
        marker?.getElement().classList.remove('user-map__marker-avatar-highlighted')
      }
    }
  }, [highlightedUserId])

  return (
    <div className="user-map">
      <div ref={mapContainerRef} className="user-map__map" />
      {isBlocked && (
        <div className="map-blocker">
          {children}
        </div>
      )}
    </div>
  )
}