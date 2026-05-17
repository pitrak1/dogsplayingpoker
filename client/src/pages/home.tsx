import { User } from '@/types/user'
import { MapView } from '@/components/map/mapView'
import { SearchSidebar } from '@/components/map/searchSidebar'
import { useState } from 'react'
import { DEMO_USERS } from '@/constants/demoUsers'
import 'mapbox-gl/dist/mapbox-gl.css'
import './home.scss'

export function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [searchedLocation, setSearchedLocationChange] = useState<string | null>(null)

  return (
    <div className="home">
      <MapView
        users={DEMO_USERS}
        onMapReady={setMapInstance}
        onUserSelect={setSelectedUser}
      />
      <SearchSidebar
        mapInstance={mapInstance}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchedLocation={searchedLocation}
        onSearchLocationChange={setSearchedLocationChange}
      />
    </div>
  )
}
