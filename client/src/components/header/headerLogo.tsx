import logo from '@/assets/logo.svg'
import './headerLogo.scss'

export function HeaderLogo() {
  return (
    <div className="logo">
      <a className="logo__link" href="/">
        <img src={logo} alt="Logo" />
      </a>
      <h1 className="logo__name">DogsPlayingPoker</h1>
    </div>
  )
}
