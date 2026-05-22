import { MapView } from '@/components/map/mapView'
import { SearchSidebar } from '@/components/map/searchSidebar'
import { useCallback, useState } from 'react'
import { DEMO_USERS } from '@/constants/demoUsers'
import { useSearchParams } from 'react-router'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import 'mapbox-gl/dist/mapbox-gl.css'
import './home.scss'

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchValue, setSearchValue] = useState('')
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [searchedLocation, setSearchedLocationChange] = useState<string | null>(null)

  const lat = parseFloat(searchParams.get('lat') ?? DEFAULT_MAP_CENTER.latitude.toString())
  const lng = parseFloat(searchParams.get('lng') ?? DEFAULT_MAP_CENTER.longitude.toString())
  const zoom = parseFloat(searchParams.get('zoom') ?? DEFAULT_MAP_CENTER.zoom.toString())

  const handleMapMove = useCallback((lat: number, lng: number, zoom: number) => {
    setSearchParams({
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      zoom: zoom.toFixed(2),
    }, { replace: true })
  }, [setSearchParams])

  return (
    <div className="home">
      <MapView
        users={DEMO_USERS}
        initialLat={lat}
        initialLng={lng}
        initialZoom={zoom}
        onMapReady={setMapInstance}
        onMapMove={handleMapMove}
      />
      <SearchSidebar
        users={DEMO_USERS}
        mapInstance={mapInstance}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchedLocation={searchedLocation}
        onSearchLocationChange={setSearchedLocationChange}
      />
    </div>
  )
}
