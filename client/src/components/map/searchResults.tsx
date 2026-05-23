import { SearchBox } from '@mapbox/search-js-react'
import mapboxgl from 'mapbox-gl'
import { User } from '@/types/user'
import { metersToMiles } from '@/lib/maps'
import { MapPin, PawPrint } from 'lucide-react'
import './searchResults.scss'

type Props = {
  users: User[] | null
  pageNumber: number | null
  onPageChange: (value: number | null) => void
}

export function SearchResults({ users, pageNumber, onPageChange }: Props) {
  const userItems = users?.map((user, index) => (
    <div key={user.id} className="search-result-item">
      <div className="search-result-item__index">{index + 1}</div>
      {user.profileImageUrl && (
        <div className="search-result-item__profile-image">
          <img
            className="search-result-item__profile-image"
            src={user.profileImageUrl}
            alt={`${user.username}'s profile`}
          />
        </div>
      )}
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
      <svg
        className="search-result-item__nav-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  ))

  if (users === null || users.length === 0) {
    return <div className="search-results">No results found</div>
  }

  return <div className="search-results">{userItems}</div>
}
