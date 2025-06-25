import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Team Health Check</h1>
        <p>
          Assess your team's health based on Google's research on successful teams.
          Evaluate four key areas: Psychological Safety, Dependability, Structure & Clarity, and Meaning & Impact.
        </p>
        <Link to="/teams" className="cta-button">
          Get Started
        </Link>
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>Psychological Safety</h3>
          <p>Can team members take risks and be vulnerable without feeling insecure or embarrassed?</p>
        </div>
        <div className="feature">
          <h3>Dependability</h3>
          <p>Can team members count on each other to do high quality work on time?</p>
        </div>
        <div className="feature">
          <h3>Structure & Clarity</h3>
          <p>Are goals, roles, and execution plans clear to everyone on the team?</p>
        </div>
        <div className="feature">
          <h3>Meaning & Impact</h3>
          <p>Does the work have personal meaning and create positive impact?</p>
        </div>
      </div>
    </div>
  )
}

export default Home