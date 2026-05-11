import { Link } from 'react-router'
import './returnHome.scss'

export function ReturnHome() {
  return (
    <div className="return-home">
      <Link to="/">Back to Home</Link>
    </div>
  )
}
