import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Team Health Check
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/teams" className="nav-link">Teams</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation