import Map from 'react-map-gl/mapbox'
import { User } from '@/types/user'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { HEADER_HEIGHT } from '@/constants/layout'
import './searchMap.scss'

type Props = {
  users: User[]
  searchValue: string
}

export function SearchMap({ users, searchValue }: Props) {
  return (
    <div className='search-map__container'>
        <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            initialViewState={DEFAULT_MAP_CENTER}
            style={{ width: '100%', height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
        >
            {/* {user && (
                <MapRange user={user} latitude={DEFAULT_MAP_CENTER.latitude} longitude={DEFAULT_MAP_CENTER.longitude} radiusMiles={5}/>
            )} */}
        </Map>
        <div className="search-map__input">
            <input type="text" placeholder="Search for pets near..." />
        </div>
    </div>
  )
}