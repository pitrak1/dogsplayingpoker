import type { FullUser as User } from 'dogsplayingpoker-shared/user'
import { useNavigate } from 'react-router'
import { SearchResultDisplay } from './searchResultDisplay'
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

  const hasUsers = !!users && users.length > 0

  return (
    <div className="search-results">
      {hasUsers && users?.map((user, index) => (
        <SearchResultDisplay
          key={user.id}
          user={user}
          resultNumber={index + 1}
          isHighlighted={user.id === highlightedUser?.id}
          onClick={onUserClick}
          onSearchResultHover={onSearchResultHover}
        />
      ))}
      {!hasUsers && (
        <div className="search-results__empty-text">
          No pets found in search area.
        </div>
      )}
    </div>
  )
}
