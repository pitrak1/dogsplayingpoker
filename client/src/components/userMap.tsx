import { useRef, useEffect } from 'react'
import { useMapboxMap } from '@/hooks/useMapboxMap'
import type { FullUser } from 'dogsplayingpoker-shared/user'
import { addUserRange, removeUserRange } from '@/lib/maps'
import type { MapPosition } from 'dogsplayingpoker-shared/common'
import { useMapboxMapMarkers } from '@/hooks/useMapboxMapMarkers'
import { renderUserMarker } from '@/lib/maps'
import './userMap.scss'

type MapProps = {
  users: FullUser[] | FullUser
  highlightedUser?: FullUser | null
  initialPosition: MapPosition
  caption?: string
  /* If you lock movement and do not provide an onScroll/onDoubleClick, zooming is centered */
  lockMovement?: boolean
  isBlocked?: boolean
  onMapReady?: (map: mapboxgl.Map) => void
  onMapMove?: (map: mapboxgl.Map) => void
  onScroll?: (map: mapboxgl.Map, e: WheelEvent) => void
  onDoubleClick?: (map: mapboxgl.Map, e: MouseEvent) => void
  onClickMarker?: (user: FullUser) => void
  onHoverMarker?: (user: FullUser | null) => void
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
  const { mapRef } = useMapboxMap({
    container: mapContainerRef,
    initialPosition,
    lockMovement,
    onMapReady,
    onMapMove,
    onScroll,
    onDoubleClick,
  })
  const { markerRootsRef } = useMapboxMapMarkers({ mapRef, users, onClickMarker, onHoverMarker })
  const previousHighlightedUserRef = useRef<FullUser | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Recall previous highlighted user and update stored value
    const previous = previousHighlightedUserRef.current
    previousHighlightedUserRef.current = highlightedUser ?? null

    // Rerender avatar at increased size for highlighted user
    if (highlightedUser) {
      const root = markerRootsRef.current.get(highlightedUser.id)
      if (root) renderUserMarker(root, highlightedUser, 48, () => onClickMarker?.(highlightedUser))
    }
      
    // Rerender avatar at normal size for previous user
    if (previous) {
      const root = markerRootsRef.current.get(previous.id)
      if (root) renderUserMarker(root, previous, 32, () => onClickMarker?.(previous))
    }
    
    // Add the range for the highlighted user
    let sourceId: string | undefined
    if (highlightedUser) {
      sourceId = addUserRange(map, highlightedUser)
    }

    return () => {
      try {
        removeUserRange(map, sourceId)
      } catch {
        // Map is already town down, no cleanup necessary
      }
    }
  }, [mapRef, markerRootsRef, highlightedUser, onClickMarker])

  return (
    <div className="user-map">
      <div ref={mapContainerRef} className="user-map__map" />
      {isBlocked && children}
    </div>
  )
}