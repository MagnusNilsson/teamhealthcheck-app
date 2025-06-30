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
        <h1>Team Health Results</h1>
        <h2>{results.team_name}</h2>
        <p className="assessment-count">
          Based on {results.assessment_count} assessment{results.assessment_count !== 1 ? 's' : ''}
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
            <h3>Team Health Overview</h3>
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
              <p>Team members feel safe to take risks and be vulnerable</p>
            </div>

            <div className="result-card">
              <h3>Dependability</h3>
              <div className={`score ${getScoreColor(results.dependability_avg)}`}>
                {results.dependability_avg.toFixed(1)}
              </div>
              <div className="score-label">
                {getScoreLabel(results.dependability_avg)}
              </div>
              <p>Team members can count on each other for quality work</p>
            </div>

            <div className="result-card">
              <h3>Structure & Clarity</h3>
              <div className={`score ${getScoreColor(results.structure_clarity_avg)}`}>
                {results.structure_clarity_avg.toFixed(1)}
              </div>
              <div className="score-label">
                {getScoreLabel(results.structure_clarity_avg)}
              </div>
              <p>Goals, roles, and execution plans are clear</p>
            </div>

            <div className="result-card">
              <h3>Meaning & Impact</h3>
              <div className={`score ${getScoreColor(results.meaning_impact_avg)}`}>
                {results.meaning_impact_avg.toFixed(1)}
              </div>
              <div className="score-label">
                {getScoreLabel(results.meaning_impact_avg)}
              </div>
              <p>Work has personal meaning and creates positive impact</p>
            </div>
          </div>

          <div className="results-actions">
            <Link to={`/assessment/${teamId}`} className="btn-primary">
              New Assessment
            </Link>
            <Link to="/teams" className="btn-outline">
              Back to Teams
            </Link>
          </div>

          <div className="insights">
            <h3>Insights & Recommendations</h3>
            <div className="insight-cards">
              {results.psychological_safety_avg < 3 && (
                <div className="insight-card">
                  <h4>Improve Psychological Safety</h4>
                  <p>Consider team building activities, establish ground rules for respectful communication, and encourage vulnerability from leadership.</p>
                </div>
              )}
              {results.dependability_avg < 3 && (
                <div className="insight-card">
                  <h4>Strengthen Dependability</h4>
                  <p>Focus on clear commitments, regular check-ins, and accountability practices. Ensure team has necessary resources and skills.</p>
                </div>
              )}
              {results.structure_clarity_avg < 3 && (
                <div className="insight-card">
                  <h4>Enhance Structure & Clarity</h4>
                  <p>Define clear roles, create visible goals and KPIs, establish regular communication rhythms, and maintain prioritized backlogs.</p>
                </div>
              )}
              {results.meaning_impact_avg < 3 && (
                <div className="insight-card">
                  <h4>Increase Meaning & Impact</h4>
                  <p>Connect work to larger purpose, highlight team achievements, align individual goals with team objectives, and share success stories.</p>
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