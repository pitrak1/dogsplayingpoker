import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { debounce } from 'es-toolkit'

type Options = {
  container: React.RefObject<HTMLDivElement | null>
  initialLat: number
  initialLng: number
  initialZoom: number
  onMapReady: (map: mapboxgl.Map) => void
  onMapMove: (lat: number, lng: number, zoom: number) => void
}

export const useMapboxMap = ({ container, initialLat, initialLng, initialZoom, onMapReady, onMapMove }: Options) => {
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
    })
    mapRef.current.on('load', () => {
      setMapLoaded(true)
      onMapReady(mapRef.current!)
    })
    return () => { mapRef.current?.remove() }
  }, [])

  // move handler
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current
    const handler = debounce(() => {
      const c = map.getCenter()
      onMapMove(c.lat, c.lng, map.getZoom())
    }, 200)
    map.on('moveend', handler)
    return () => {
      handler.cancel()
      map.off('moveend', handler)
    }
  }, [mapLoaded, onMapMove])

  return { mapRef, mapLoaded }
}