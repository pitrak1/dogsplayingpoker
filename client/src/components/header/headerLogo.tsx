import logo from '@/assets/logo.svg'
import { Link } from 'react-router'
import './headerLogo.scss'

export function HeaderLogo() {
  return (
    <div className="logo">
      <Link to="/">
        <img src={logo} alt="Logo" />
      </Link>
      <h1 className="logo__name">DogsPlayingPoker</h1>
    </div>
  )
}
