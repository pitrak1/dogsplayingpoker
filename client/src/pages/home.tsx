import { MapView } from '@/components/map/mapView'
import { SearchSidebar } from '@/components/map/searchSidebar'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import 'mapbox-gl/dist/mapbox-gl.css'
import './home.scss'
import { InferRequestType } from 'hono'
import { rpc } from '@/api/rpc'
import { useSearchUsers } from '@/api/users'

type SearchUsersInput = InferRequestType<typeof rpc.api.users.search.$get>['query']

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [searchedLocation, setSearchedLocationChange] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState<SearchUsersInput | null>(null)

  const lat = parseFloat(searchParams.get('lat') ?? DEFAULT_MAP_CENTER.latitude.toString())
  const lng = parseFloat(searchParams.get('lng') ?? DEFAULT_MAP_CENTER.longitude.toString())
  const zoom = parseFloat(searchParams.get('zoom') ?? DEFAULT_MAP_CENTER.zoom.toString())

  const handleMapMove = useCallback(
    (map: mapboxgl.Map) => {
      const bounds = map.getBounds()!
      const center = map.getCenter()
      const zoom = map.getZoom()

      setSearchParams(
        {
          lat: center.lat.toFixed(6),
          lng: center.lng.toFixed(6),
          zoom: zoom.toFixed(2),
        },
        { replace: true },
      )

      setSearchInput({
        swLat: String(bounds.getSouth()),
        swLng: String(bounds.getWest()),
        neLat: String(bounds.getNorth()),
        neLng: String(bounds.getEast()),
        centerLat: String(center.lat),
        centerLng: String(center.lng),
        page: '1',
      })
    },
    [setSearchParams],
  )

  const { data: users } = useSearchUsers(searchInput)

  return (
    <div className="home">
      <MapView
        users={users ?? []}
        initialLat={lat}
        initialLng={lng}
        initialZoom={zoom}
        onMapReady={setMapInstance}
        onMapMove={handleMapMove}
      />
      <SearchSidebar
        users={users ?? []}
        mapInstance={mapInstance}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchedLocation={searchedLocation}
        onSearchLocationChange={setSearchedLocationChange}
      />
    </div>
  )
}
