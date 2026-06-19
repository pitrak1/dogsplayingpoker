import { useState, useRef, useCallback, useEffect } from 'react'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { useMapboxMap } from '@/hooks/useMapboxMap'
import { User } from '@/types/user'
import { addUserMarker, addUserRange, removeUserRange } from '@/lib/maps'
import mapboxgl from 'mapbox-gl'
import './userMap.scss'

type MapProps = {
  users: User[] | User
  hoveredUserIds?: number[]
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
  onHoverMarker?: (user: User) => void
  onRedoSearch?: () => void
  children?: React.ReactNode
}

export function UserMap({ 
  users, 
  hoveredUserIds, 
  initialPosition,
  caption,
  lockMovement,
  isBlocked,
  onMapReady, 
  onMapMove,
  onScroll,
  onDoubleClick,
  onClickMarker,
  onHoverMarker,
  onRedoSearch,
  children
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [hasMoved, setHasMoved] = useState<boolean>(false)
  const markersRef = useRef(new Map<number, mapboxgl.Marker>())

  const handleMapMove = useCallback(
    (map: mapboxgl.Map) => {
      setHasMoved(true)
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

  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current!
    const sourceIds: string[] = []

    const addMarker = (u: User) => {
      if (!u.longitude || !u.latitude) return
      const el = addUserMarker(map, u, () => onClickMarker && onClickMarker(u), onHoverMarker)
      markersRef.current.set(u.id, el)

      if (!u.radiusMiles || u.radiusMiles == 0) return
      sourceIds.push(addUserRange(map, u))
    }

    if (Array.isArray(users)) {
      users.forEach(addMarker)
    } else {
      addMarker(users)
    }

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current.clear()
      sourceIds.forEach((id) => removeUserRange(map, id))
    }
  }, [mapLoaded, users, onClickMarker])

  useEffect(() => {
    if (hoveredUserIds) {
      hoveredUserIds.forEach(id => {
        const marker = markersRef.current.get(id)
        marker?.getElement().classList.add('user-map__marker-avatar-highlighted')
      })
    }

    return () => {
      if (hoveredUserIds) {
        hoveredUserIds.forEach(id => {
          const marker = markersRef.current.get(id)
          marker?.getElement().classList.remove('user-map__marker-avatar-highlighted')
        })
      }
    }
  }, [hoveredUserIds])

  return (
    <div className="user-map">
      {hasMoved && onRedoSearch && <button className="user-map__button" onClick={onRedoSearch}>Redo search in map</button>}
      <div className="user-map__container">
        <div ref={mapContainerRef} className="user-map__map" />
        {isBlocked && (
          <div className="map-blocker">
            {children}
          </div>
        )}
      </div>
      {caption && <div className="user-map__caption">{caption}</div>}
    </div>
  )
}