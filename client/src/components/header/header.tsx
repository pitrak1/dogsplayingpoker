import { HeaderNav } from '@/components/header/headerNav'
import { UserMenu } from '@/components/header/userMenu'
import { useLocation, Link } from 'react-router'
import { Button } from '@mantine/core'
import { useAuth } from '@/context/auth'
import logo from '@/assets/logo.svg'
import './header.scss'

export function Header() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  const isAuthPage = ['/login', '/signup'].includes(pathname)

  const showReturnHome = isAuthPage
  const showUserMenu = !isAuthPage && !!user
  const showAuthButtons = !isAuthPage && !user

  return (
    <div className="header">
      <div className="header__left">
        <HeaderNav />
        <Link to="/" className="header__logo-link">
          <img src={logo} alt="Logo" className="header__logo" />
          <span className="header__name">DogsPlayingPoker</span>
        </Link>
      </div>
      {showReturnHome && <Button component={Link} to="/" variant="filled" color="brand" size="lg">Return home</Button>}
      {showUserMenu && <UserMenu />}
      {showAuthButtons && (
        <div className="header__auth-buttons">
          <Button component={Link} to="/login" variant="filled" color="brand" size="lg">Log in</Button>
          <Button component={Link} to="/signup" variant="filled" color="brand" size="lg">Sign up</Button>
        </div>
      )}
    </div>
  )
}
