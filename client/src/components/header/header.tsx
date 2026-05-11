import { HeaderLogo } from '@/components/header/headerLogo'
import { Nav } from '@/components/header/nav'
import { ReturnHome } from '@/components/header/returnHome'
import { UserMenu } from '@/components/header/userMenu'
import { useLocation } from 'react-router'
import './header.scss'

export function Header() {
  const { pathname } = useLocation()

  const isAuthPage = ["/login", "/signup"].includes(pathname)

  const renderHeaderContent = () => {
    if (isAuthPage) {
      return (
        <div className="header__return-home">
          <ReturnHome />
        </div>
      )
    } else {
      return (
        <>
          <div className="header__nav">
            <Nav />
          </div>
          <div className="header__user-menu">
            <UserMenu />
          </div>
        </>
      )
    }
  }

  return (
    <div className="header">
      <div className="header__logo">
        <HeaderLogo />
      </div>
      {renderHeaderContent()}
    </div>
  )
}
