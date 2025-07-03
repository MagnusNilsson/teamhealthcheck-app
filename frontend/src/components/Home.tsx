import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Professional Team Health Assessment</h1>
        <p>
          Evidence-based team evaluation platform built on Google's Project Aristotle research. 
          Scientifically measure and improve your team's effectiveness across four critical dimensions 
          proven to drive high-performing teams.
        </p>
        <Link to="/teams" className="btn-primary cta-button">
          Begin Assessment
        </Link>
      </div>
      
      <div className="features">
        <div className="feature">
          <div className="feature-icon">🛡️</div>
          <h3>Psychological Safety</h3>
          <p>Measures the team's ability to show vulnerability, ask questions, and admit mistakes without fear of negative consequences.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">⚡</div>
          <h3>Dependability</h3>
          <p>Evaluates team members' reliability in completing quality work on time and following through on commitments.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <h3>Structure & Clarity</h3>
          <p>Assesses clarity of goals, roles, and execution plans, ensuring everyone understands their responsibilities and objectives.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🌟</div>
          <h3>Meaning & Impact</h3>
          <p>Measures the personal significance of work and the team's understanding of their positive impact on the organization.</p>
        </div>
      </div>
    </div>
  )
}

export default Home