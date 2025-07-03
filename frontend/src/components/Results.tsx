import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import RadarChart from './RadarChart'

interface TeamResults {
  team_id: number
  team_name: string
  assessment_count: number
  psychological_safety_avg: number
  dependability_avg: number
  structure_clarity_avg: number
  meaning_impact_avg: number
}

const Results = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const [results, setResults] = useState<TeamResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [teamId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`http://localhost:8000/teams/${teamId}/results/`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'score-excellent'
    if (score >= 3) return 'score-good'
    if (score >= 2) return 'score-fair'
    return 'score-poor'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 4) return 'Excellent'
    if (score >= 3) return 'Good'
    if (score >= 2) return 'Fair'
    return 'Needs Improvement'
  }

  if (loading) {
    return <div className="loading">Loading results...</div>
  }

  if (!results) {
    return <div className="error">Results not found</div>
  }

  return (
    <div className="results">
      <div className="results-header">
        <h1>Team Health Assessment Report</h1>
        <h2>{results.team_name}</h2>
        <p className="assessment-count">
          Analysis based on {results.assessment_count} participant response{results.assessment_count !== 1 ? 's' : ''} 
          • Generated on {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {results.assessment_count === 0 ? (
        <div className="no-assessments">
          <p>No assessments completed yet.</p>
          <Link to={`/assessment/${teamId}`} className="btn-primary">
            Take First Assessment
          </Link>
        </div>
      ) : (
        <>
          <div className="radar-chart-section">
            <h3>Executive Summary: Team Performance Analysis</h3>
            <p className="chart-description">
              The radar chart below visualizes your team's performance across the four critical dimensions 
              of team effectiveness. Each axis represents average scores from participant responses.
            </p>
            <RadarChart data={{
              psychological_safety_avg: results.psychological_safety_avg,
              dependability_avg: results.dependability_avg,
              structure_clarity_avg: results.structure_clarity_avg,
              meaning_impact_avg: results.meaning_impact_avg
            }} />
          </div>

          <div className="results-grid">
            <div className="result-card">
              <h3>Psychological Safety</h3>
              <div className={`score ${getScoreColor(results.psychological_safety_avg)}`}>
                {results.psychological_safety_avg.toFixed(1)}
              </div>
              <div className="score-label">
                {getScoreLabel(results.psychological_safety_avg)}
              </div>
              <p>Measures the team's ability to show vulnerability, take risks, and express ideas without fear of judgment or negative consequences.</p>
            </div>

            <div className="result-card">
              <h3>Dependability</h3>
              <div className={`score ${getScoreColor(results.dependability_avg)}`}>
                {results.dependability_avg.toFixed(1)}
              </div>
              <div className="score-label">
                {getScoreLabel(results.dependability_avg)}
              </div>
              <p>Evaluates team members' reliability in completing high-quality work on time and following through on commitments.</p>
            </div>

            <div className="result-card">
              <h3>Structure & Clarity</h3>
              <div className={`score ${getScoreColor(results.structure_clarity_avg)}`}>
                {results.structure_clarity_avg.toFixed(1)}
              </div>
              <div className="score-label">
                {getScoreLabel(results.structure_clarity_avg)}
              </div>
              <p>Assesses clarity of goals, roles, and execution plans to ensure everyone understands their responsibilities and objectives.</p>
            </div>

            <div className="result-card">
              <h3>Meaning & Impact</h3>
              <div className={`score ${getScoreColor(results.meaning_impact_avg)}`}>
                {results.meaning_impact_avg.toFixed(1)}
              </div>
              <div className="score-label">
                {getScoreLabel(results.meaning_impact_avg)}
              </div>
              <p>Measures the personal significance of work and team members' understanding of their positive organizational impact.</p>
            </div>
          </div>

          <div className="results-actions">
            <Link to={`/results/${teamId}/details`} className="btn-secondary">
              View Detailed Analysis
            </Link>
            <Link to={`/assessment/${teamId}`} className="btn-primary">
              Conduct New Assessment
            </Link>
            <Link to="/teams" className="btn-outline">
              Return to Dashboard
            </Link>
          </div>

          <div className="insights">
            <h3>Professional Recommendations & Action Items</h3>
            <div className="insight-cards">
              {results.psychological_safety_avg < 3 && (
                <div className="insight-card">
                  <h4>Priority: Enhance Psychological Safety</h4>
                  <p><strong>Recommended Actions:</strong> Implement structured team building exercises, establish explicit communication norms, model vulnerability through leadership behavior, and create safe spaces for risk-taking and mistake acknowledgment.</p>
                </div>
              )}
              {results.dependability_avg < 3 && (
                <div className="insight-card">
                  <h4>Priority: Strengthen Team Dependability</h4>
                  <p><strong>Recommended Actions:</strong> Implement clear commitment protocols, establish regular progress check-ins, develop accountability frameworks, and ensure adequate resource allocation and skill development opportunities.</p>
                </div>
              )}
              {results.structure_clarity_avg < 3 && (
                <div className="insight-card">
                  <h4>Priority: Improve Structure & Clarity</h4>
                  <p><strong>Recommended Actions:</strong> Define and document clear role definitions, establish visible goal-setting frameworks with measurable KPIs, implement regular communication cadences, and maintain transparent project prioritization systems.</p>
                </div>
              )}
              {results.meaning_impact_avg < 3 && (
                <div className="insight-card">
                  <h4>Priority: Amplify Meaning & Impact</h4>
                  <p><strong>Recommended Actions:</strong> Connect individual contributions to organizational mission, implement recognition systems for achievements, align personal development goals with team objectives, and regularly communicate success stories and impact metrics.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Results