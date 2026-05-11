import { Link } from 'react-router'
import './userMenu.scss'

export function UserMenu() {
  return (
    <div className="user-menu">
      <Link to="/login">Log in</Link>
      <Link to="/signup">Sign up</Link>
    </div>
  )
}
