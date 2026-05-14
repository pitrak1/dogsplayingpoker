import { useQuery } from '@apollo/client'
import { GET_USERS } from './home.queries'
import { User } from '@/types/user'
import Map from 'react-map-gl/mapbox'
import { DEFAULT_MAP_CENTER } from '@/constants/map'
import { MapRange } from '@/components/map/mapRange'
import { MapPoint } from '@/components/map/mapPoint'
import { useAuth } from '@/context/auth'
import 'mapbox-gl/dist/mapbox-gl.css'
import './home.scss'

export function Home() {
  const { data, loading, error, refetch } = useQuery<{ users: User[] }>(GET_USERS)
  const { user } = useAuth()

  if (loading) return <p>Loading…</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="home">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={DEFAULT_MAP_CENTER}
        style={{ width: '100%', height: '800px' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {user && (
          <MapRange user={user} latitude={DEFAULT_MAP_CENTER.latitude} longitude={DEFAULT_MAP_CENTER.longitude} radiusMiles={5}/>
        )}
      </Map>
      <button onClick={() => refetch()}>REFRESH</button>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data?.users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
