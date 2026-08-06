import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { MapPosition } from 'dogsplayingpoker-shared/common'

type Options = {
  container: React.RefObject<HTMLDivElement | null>
  initialPosition: MapPosition
  /* If you lock movement and do not provide an onScroll/onDoubleClick, zooming is centered */
  lockMovement?: boolean
  onMapReady?: (map: mapboxgl.Map) => void
  onMapMove?: (map: mapboxgl.Map) => void
  /* onScroll and onDoubleClick assume you want to override the default mapbox behavior */
  onScroll?: (map: mapboxgl.Map, e: WheelEvent) => void
  onDoubleClick?: (map: mapboxgl.Map, e: MouseEvent) => void
}

export const useMapboxMap = ({
  container,
  initialPosition,
  lockMovement,
  onMapReady,
  onMapMove,
  onScroll,
  onDoubleClick
}: Options) => {
  const mapRef = useRef<mapboxgl.Map | null>(null)

  // init + cleanup
  useEffect(() => {
    if (!container.current) return

    // If you've locked movement, obviously dragging the map should be disabled
    const dragPan = !lockMovement

    // Double clicking to zoom should only be available if we haven't locked movement and the user
    // hasn't passed a prop specifically to override double click behavior
    const doubleClickZoom = !lockMovement && !onDoubleClick

    // Scrolling to zoom should function in the same way as doubleClickZoom except a different override handler
    const scrollZoom = !lockMovement && !onScroll

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    mapRef.current = new mapboxgl.Map({
      container: container.current,
      center: [initialPosition.lng, initialPosition.lat],
      zoom: initialPosition.zoom,
      style: 'mapbox://styles/mapbox/dark-v10',
      dragRotate: false,
      dragPan,
      doubleClickZoom,
      scrollZoom
    })

    mapRef.current.on('load', () => {
      if (onMapReady) onMapReady(mapRef.current!)
    })
    
    return () => {
      mapRef.current?.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // attaches onMapMove handler if it exists
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current
    const handler = () => onMapMove && onMapMove(map)
    map.on('moveend', handler)
    return () => {
      map.off('moveend', handler)
    }
  }, [mapRef, onMapMove])

  // Attaches the scroll and dblclick handlers.  Each one handles the three situations (in this priority):
  // 1. calls the appropriate handler if given
  // 2. does a manual map manipulation if lockMovement is set
  // 3. Default map behavior for action if handler is not given or lockMovement is not set
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current
    const container = map.getContainer()

    const scrollHandler = (e: WheelEvent) => {
      if (onScroll) {
        e.preventDefault()
        onScroll(map, e)
        return
      }
      
      if (lockMovement) {
        e.preventDefault()
        map.easeTo({
          center: map.getCenter(),
          zoom: map.getZoom() + (e.deltaY < 0 ? 1 : -1),
          duration: 200,
        })
      }
    }

    const doubleClickHandler = (e: MouseEvent) => {
      if (onDoubleClick) {
        e.preventDefault()
        onDoubleClick(map, e)
        return
      }
      
      if (lockMovement) {
        e.preventDefault()
        map.easeTo({
          center: map.getCenter(),
          zoom: map.getZoom() + 2,
          duration: 200,
        })
      }
    }

    container.addEventListener('wheel', scrollHandler, { passive: false })
    container.addEventListener('dblclick', doubleClickHandler, { passive: false })

    return () => {
      container.removeEventListener('wheel', scrollHandler)
      container.removeEventListener('dblclick', doubleClickHandler)
    }
  }, [mapRef, onScroll, onDoubleClick, lockMovement])

  return { mapRef }
}
