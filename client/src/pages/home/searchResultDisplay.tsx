import type { FullUser } from 'dogsplayingpoker-shared/user'
import { metersToMiles } from '@/lib/maps'
import { MapPin, PawPrint, ArrowRight } from 'lucide-react'
import { AvatarDisplay } from '@/components/avatarDisplay'
import './searchResultDisplay.scss'

type Props = {
  user: FullUser
  isHighlighted: boolean
  resultNumber: number
  onClick: (user: FullUser) => void
  onSearchResultHover: (user: FullUser | null) => void
}

export function SearchResultDisplay({ user, isHighlighted, resultNumber, onClick, onSearchResultHover }: Props) {
  return (
    <button
      className={`search-result-display${isHighlighted ? '--highlighted' : ''}`}
      onClick={() => onClick(user)}
      onMouseEnter={() => onSearchResultHover(user)}
      onMouseLeave={() => onSearchResultHover(null)}
    >
      <div className="search-result-display__index">{resultNumber}</div>
      <div className="search-result-display__body">
        <AvatarDisplay imageUrl={user.profileImageUrl ?? null} name={user.username} size={60} />
        <div className="search-result-display__info">
          <div className="search-result-display__username">{user.username}</div>
          <div className="search-result-display__user-info">
            {user.radiusMiles && (
              <div className="search-result-display__user-info-item">
                <MapPin size={16} />
                {metersToMiles(user.radiusMiles).toFixed(1)}mi
              </div>
            )}
            <div className="search-result-display__user-info-item">
              <PawPrint size={16} />
              {user.pets.length} pets
            </div>
          </div>
        </div>
      </div>
      <ArrowRight />
    </button>
  )
}
