import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

type Options = {
  container: React.RefObject<HTMLDivElement | null>
  initialLat: number
  initialLng: number
  initialZoom: number
  /* If you lock movement and do not provide an onScroll/onDoubleClick, zooming is centered */
  lockMovement?: boolean
  onMapReady: (map: mapboxgl.Map) => void
  onMapMove?: (map: mapboxgl.Map) => void
  /* onScroll and onDoubleClick assume you want to override the default mapbox behavior */
  onScroll?: (map: mapboxgl.Map, e: WheelEvent) => void
  onDoubleClick?: (map: mapboxgl.Map, e: MouseEvent) => void
}

export const useMapboxMap = ({
  container,
  initialLat,
  initialLng,
  initialZoom,
  lockMovement,
  onMapReady,
  onMapMove,
  onScroll,
  onDoubleClick
}: Options) => {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // init + cleanup
  useEffect(() => {
    if (!container.current) return

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    mapRef.current = new mapboxgl.Map({
      container: container.current,
      center: [initialLng, initialLat],
      zoom: initialZoom,
      style: 'mapbox://styles/mapbox/dark-v10',
      dragRotate: false,
      dragPan: !lockMovement,
      doubleClickZoom: !(lockMovement || onDoubleClick),
      scrollZoom: !(lockMovement || onScroll)
    })

    mapRef.current.on('load', () => {
      setMapLoaded(true)
      onMapReady(mapRef.current!)
    })
    
    return () => {
      mapRef.current?.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // move handler
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current
    const handler = () => onMapMove && onMapMove(map)
    map.on('moveend', handler)
    return () => {
      map.off('moveend', handler)
    }
  }, [mapLoaded, onMapMove])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

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
  }, [mapLoaded, onScroll, onDoubleClick, lockMovement])

  return { mapRef, mapLoaded }
}
