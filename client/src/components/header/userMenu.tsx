import { Link } from 'react-router'
import { useAuth } from '@/context/auth'
import { useState } from 'react'
import { DownArrow } from '@/components/shared/downArrow'
import './userMenu.scss'

export function UserMenu() {
  const { user, clearAuth } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const logout = () => {
    clearAuth()
  }

  const renderMenuContents = () => {
    if (user) {
      return (
        <div className="user-menu__username-display">
          <button className="user-menu__username-button" onClick={() => setIsOpen(!isOpen)}>
            {user.profileImageUrl && <img src={user.profileImageUrl} alt={user.username} className="avatar avatar--small" />}
            {user.username}
            <DownArrow />
          </button>
          {isOpen && (
            <div className="user-menu__dropdown">
              <Link to="/" onClick={logout}>
                Log out
              </Link>
            </div>
          )}
        </div>
      )
    } else {
      return (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </>
      )
    }
  }

  return <div className="user-menu">{renderMenuContents()}</div>
}
