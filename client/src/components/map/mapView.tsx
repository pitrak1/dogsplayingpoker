import { User } from '@/types/user'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { useRef, useState, useEffect } from 'react'
import { getCircleStops } from '@/lib/maps'
import mapboxgl from 'mapbox-gl'
import './mapView.scss'

type Props = {
  users: User[]
  onMapReady: (map: mapboxgl.Map) => void
  onUserSelect: (value: User) => void
}

export function MapView({ users, onMapReady, onUserSelect }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken = accessToken
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [DEFAULT_MAP_CENTER.longitude, DEFAULT_MAP_CENTER.latitude],
      zoom: DEFAULT_MAP_CENTER.zoom,
      style: 'mapbox://styles/mapbox/dark-v10',
    })

    mapInstanceRef.current.on('load', () => {
      setMapLoaded(true)
      onMapReady(mapInstanceRef.current!)
    })

    return () => {
      mapInstanceRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return

    const map = mapInstanceRef.current
    const markers: mapboxgl.Marker[] = []

    users.forEach((user) => {
      if (!user.longitude || !user.latitude || !user.radiusMiles) return

      const marker = addMarker(user)
      markers.push(marker)
      addRange(user)
    })

    return () => {
      // remove markers
      markers.forEach((marker) => marker.remove())

      // If we navigate away from the page and unmount this whole component, the map will clean itself up
      if (!map.isStyleLoaded()) return

      // remove layers and sources
      users.forEach((user) => {
        const sourceId = `range-${user.id}`
        if (map.getLayer(`${sourceId}-fill`)) map.removeLayer(`${sourceId}-fill`)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      })
    }
  }, [mapLoaded, users])

  const addMarker = (user: User) => {
    const map = mapInstanceRef.current
    const el = document.createElement('div')
    el.className = 'marker marker--avatar'
    if (user.profileImageUrl) {
      el.style.backgroundImage = `url(${user.profileImageUrl})`
    }
    el.addEventListener('click', () => onUserSelect(user))
    return new mapboxgl.Marker({ element: el })
      .setLngLat([user.longitude!, user.latitude!])
      .addTo(map!)
  }

  const addRange = (user: User) => {
    const map = mapInstanceRef.current
    const sourceId = `range-${user.id}`
    map!.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [user.longitude!, user.latitude!] },
        properties: {},
      },
    })

    map!.addLayer({
      id: `${sourceId}-fill`,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': { stops: getCircleStops(user.radiusMiles!, user.latitude!), base: 2 },
        'circle-color': '#0066cc',
        'circle-opacity': 0.2,
        'circle-stroke-color': '#0066cc',
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.8,
      },
    })
  }

  return (
    <div className="map-view__container">
      <div ref={mapContainerRef} className="map-view__map" />
    </div>
  )
}
