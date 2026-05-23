import { SearchBox } from '@mapbox/search-js-react'
import mapboxgl from 'mapbox-gl'
import { User } from '@/types/user'
import { metersToMiles } from '@/lib/maps'
import { MapPin, PawPrint, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import './searchResults.scss'

type Props = {
  users: User[] | null
}

export function SearchResults({ users }: Props) {
  const navigate = useNavigate()

  const onUserClick = (user: User) => {
    navigate(`/profile/${user.username}`)
  }

  const userItems = users?.map((user, index) => (
    <div key={user.id} className="search-result-item" onClick={() => onUserClick(user)}>
      <div className="search-result-item__index">{index + 1}</div>
      {
        user.profileImageUrl && (
          <div className="search-result-item__profile-image">
            <img
              className="search-result-item__profile-image"
              src={user.profileImageUrl}
              alt={`${user.username}'s profile`}
            />
          </div>
        )
      }
      <div className="search-result-item__info">
        <div className="search-result-item__username">{user.username}</div>
        <div className="search-result-item__user-info">
          <div className="search-result-item__distance">
            <MapPin size={16} />
            {metersToMiles(user.distanceMeters).toFixed(1)}mi
          </div>
          <div className="search-result-item__pets">
            <PawPrint size={16} />
            {user.pets.length} pets
          </div>
        </div>
      </div>
      <ChevronRight />
    </div >
  ))

  if (users === null || users.length === 0) {
    return <div className="search-results">No results found</div>
  }

  return <div className="search-results">{userItems}</div>
}
