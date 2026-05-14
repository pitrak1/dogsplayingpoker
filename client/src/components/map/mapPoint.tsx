import { Marker } from 'react-map-gl/mapbox'
import { User } from '@/types/user'
import './mapPoint.scss'

type Props = {
  latitude: number
  longitude: number
  user: User
}

export function MapPoint({ user, latitude, longitude }: Props) {
  return (
    <Marker latitude={latitude} longitude={longitude}>
      <div className="marker marker--avatar">
          <img src="https://ui-avatars.com/api/?name=Nick+Pitrak&background=0066cc&color=fff&size=128" alt={user.username} />
      </div>
    </Marker>
  )
}