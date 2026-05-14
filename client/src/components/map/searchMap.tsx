import { User } from '@/types/user'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { SearchBox } from '@mapbox/search-js-react'
import { useRef, useState, useEffect } from 'react'
import { getCircleStops } from '@/lib/maps'
import mapboxgl from 'mapbox-gl'
import './searchMap.scss'

type Props = {
  users: User[]
  searchValue: string
  onSearchChange: (value: string) => void
  onUserSelect: (value: User) => void
}

export function SearchMap({ users, searchValue, onSearchChange, onUserSelect }: Props) {
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
    <div className="search-map__container">
      <div ref={mapContainerRef} className="search-map__map" />
      <div className="search-map__input">
        <label id="search-map__search-box-label" className="search-map__input-label">
          Enter a location to start finding friends!
        </label>
        <SearchBox
          aria-labelledby="search-map__search-box-label"
          accessToken={accessToken}
          map={mapInstanceRef.current ?? undefined}
          mapboxgl={mapboxgl}
          value={searchValue}
          onChange={onSearchChange}
          options={{ language: 'en', country: 'US' }}
        />
      </div>
    </div>
  )
}
