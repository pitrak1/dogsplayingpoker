import { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { useMapboxMap } from '@/hooks/useMapboxMap'
import { User } from '@/types/user'
import { addUserMarker, addUserRange, removeUserRange } from '@/lib/maps'
import './userMap.scss'

type MapProps = {
  users: User[] | User
  highlightedUser?: User | null
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
  highlightedUser, 
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
  const [hoveredUser, setHoveredUser] = useState<User | null>(null)

  const focusUser = useMemo(() => highlightedUser ?? hoveredUser, [highlightedUser, hoveredUser])

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

  const highlightMarker = (markers: Map<number, mapboxgl.Marker>, user: User) => {
    const marker = markers.get(user.id)
    marker?.getElement().classList.add('user-map__marker-avatar-highlighted')
  }

  const unhighlightMarker = (markers: Map<number, mapboxgl.Marker>, user: User) => {
    const marker = markers.get(user.id)
    marker?.getElement().classList.remove('user-map__marker-avatar-highlighted')
  }

  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current
    const markers = markersRef.current
    
    let sourceId: string | undefined
    if (focusUser) {
      highlightMarker(markers, focusUser)
      sourceId = addUserRange(map, focusUser)
    }
    

    return () => {
      if (focusUser) {
        unhighlightMarker(markers, focusUser)
      }

      try {
        removeUserRange(map, sourceId)
      } catch {
        // Map is already town down, no cleanup necessary
      }
    }
  }, [mapRef, focusUser])

  const handleHoverMarker = useCallback((user: User | null) => {
    if (onHoverMarker) onHoverMarker(user)
    setHoveredUser(user)
  }, [onHoverMarker])

  

  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current!
    const markers = markersRef.current

    const registerUserMarker = (user: User) => {
      if (!user.longitude || !user.latitude) return
      const el = addUserMarker(
        map, 
        user, 
        () => onClickMarker && onClickMarker(user), 
        handleHoverMarker
      )
      markers.set(user.id, el)
    }

    if (Array.isArray(users)) {
      users.forEach(registerUserMarker)
    } else {
      registerUserMarker(users)
    }

    return () => {
      markers.forEach((m) => m.remove())
      markers.clear()
    }
  }, [mapRef, mapLoaded, users, onClickMarker, handleHoverMarker])

  return (
    <div className="user-map">
      <div ref={mapContainerRef} className="user-map__map" />
      {isBlocked && children}
    </div>
  )
}