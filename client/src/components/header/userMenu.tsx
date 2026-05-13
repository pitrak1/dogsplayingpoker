import { Link } from 'react-router'
import { useAuth } from '@/context/auth'
import './userMenu.scss'

export function UserMenu() {
  const { user, clearAuth } = useAuth()

  const logout = () => {
    clearAuth()
  }

  return (
    <div className="user-menu">
      {user && <Link to="/" onClick={logout}>LOGOUT</Link>}
      {!user && <Link to="/login">Log in</Link>}
      {!user && <Link to="/signup">Sign up</Link>}
    </div>
  )
}
