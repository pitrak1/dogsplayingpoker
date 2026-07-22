import type { FullUser as User } from 'dogsplayingpoker-shared/user'
import { metersToMiles } from '@/lib/maps'
import { MapPin, PawPrint, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import './searchResults.scss'

type Props = {
  users: User[] | null
  highlightedUser?: User | null
  onSearchResultHover: (user: User | null) => void
}

export function SearchResults({ users, highlightedUser, onSearchResultHover }: Props) {
  const navigate = useNavigate()

  const onUserClick = (user: User) => {
    navigate(`/profile/${user.username}`)
  }

  const userItems = users?.map((user, index) => (
    <button
      key={user.id}
      className={`search-result-item ${user.id === highlightedUser?.id && 'search-result-item-highlighted'}`}
      onClick={() => onUserClick(user)}
      onMouseEnter={() => onSearchResultHover(user)}
      onMouseLeave={() => onSearchResultHover(null)}
    >
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
          {user.radiusMiles && (
            <div className="search-result-item__distance">
              <MapPin size={16} />
              {metersToMiles(user.radiusMiles).toFixed(1)}mi
            </div>
          )}
          <div className="search-result-item__pets">
            <PawPrint size={16} />
            {user.pets.length} pets
          </div>
        </div>
      </div>
      <ChevronRight />
    </button>
  ))

  if (users === null || users.length === 0) {
    return (
      <div className="search-results">
        <div className="search-results__empty-text">
          No pets found in search area.
        </div>
      </div>
    )
  }

  return <div className="search-results">{userItems}</div>
}
