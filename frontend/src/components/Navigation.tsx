import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">
            Team Health Assessment
            <span className="logo-subtitle">Professional Team Analytics</span>
          </span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/teams" className="nav-link">Teams</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation