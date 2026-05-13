import { Link } from 'react-router'
import { useAuth } from '@/context/auth'
import './userMenu.scss'

export function UserMenu() {
  const { user, clearAuth } = useAuth()

  const logout = () => {
    clearAuth()
  }

  const renderMenuContents = () => {
    if (user) {
      return (
        <Link to="/" onClick={logout}>LOGOUT</Link>
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

  return (
    <div className="user-menu">
      {renderMenuContents()}
    </div>
  )
}
