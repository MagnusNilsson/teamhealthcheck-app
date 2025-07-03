import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

interface ResponseWithQuestion {
  id: number
  question_id: number
  question_text: string
  question_category: string
  score: number
  notes: string | null
}

interface DetailedAssessment {
  id: number
  participant_name: string
  created_at: string
  responses: ResponseWithQuestion[]
}

interface TeamDetailedResults {
  team_id: number
  team_name: string
  assessments: DetailedAssessment[]
}

const ResultsDetails = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const [results, setResults] = useState<TeamDetailedResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDetailedResults()
  }, [teamId])

  const fetchDetailedResults = async () => {
    try {
      const response = await fetch(`http://localhost:8000/teams/${teamId}/results/detailed`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching detailed results:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'score-excellent'
    if (score >= 3) return 'score-good'
    if (score >= 2) return 'score-fair'
    return 'score-poor'
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'psychological_safety': 'Psychological Safety',
      'dependability': 'Dependability',
      'structure_clarity': 'Structure & Clarity',
      'meaning_impact': 'Meaning & Impact'
    }
    return labels[category] || category
  }

  if (loading) {
    return <div className="loading">Loading detailed results...</div>
  }

  if (!results) {
    return <div className="error">Detailed results not found</div>
  }

  if (results.assessments.length === 0) {
    return (
      <div className="results-details">
        <div className="results-header">
          <h1>Detailed Results</h1>
          <h2>{results.team_name}</h2>
        </div>
        <div className="no-assessments">
          <p>No assessments completed yet.</p>
          <Link to={`/assessment/${teamId}`} className="btn-primary">
            Take First Assessment
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="results-details">
      <div className="results-header">
        <h1>Detailed Results</h1>
        <h2>{results.team_name}</h2>
        <p className="assessment-count">
          {results.assessments.length} assessment{results.assessments.length !== 1 ? 's' : ''} completed
        </p>
      </div>

      <div className="results-actions">
        <Link to={`/results/${teamId}`} className="btn-outline">
          Back to Summary
        </Link>
        <Link to={`/assessment/${teamId}`} className="btn-primary">
          New Assessment
        </Link>
      </div>

      <div className="detailed-results-table">
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Date</th>
                <th>Psychological Safety</th>
                <th>Dependability</th>
                <th>Structure & Clarity</th>
                <th>Meaning & Impact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.assessments.map((assessment) => {
                const categoryScores = assessment.responses.reduce((acc, response) => {
                  const category = response.question_category
                  if (!acc[category]) {
                    acc[category] = { total: 0, count: 0 }
                  }
                  acc[category].total += response.score
                  acc[category].count += 1
                  return acc
                }, {} as { [key: string]: { total: number; count: number } })

                const categoryAverages = Object.keys(categoryScores).reduce((acc, category) => {
                  acc[category] = categoryScores[category].total / categoryScores[category].count
                  return acc
                }, {} as { [key: string]: number })

                return (
                  <tr key={assessment.id}>
                    <td className="participant-name">{assessment.participant_name}</td>
                    <td className="assessment-date">{formatDate(assessment.created_at)}</td>
                    <td>
                      <span className={`score-badge ${getScoreColor(categoryAverages['psychological_safety'] || 0)}`}>
                        {(categoryAverages['psychological_safety'] || 0).toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`score-badge ${getScoreColor(categoryAverages['dependability'] || 0)}`}>
                        {(categoryAverages['dependability'] || 0).toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`score-badge ${getScoreColor(categoryAverages['structure_clarity'] || 0)}`}>
                        {(categoryAverages['structure_clarity'] || 0).toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`score-badge ${getScoreColor(categoryAverages['meaning_impact'] || 0)}`}>
                        {(categoryAverages['meaning_impact'] || 0).toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-small"
                        onClick={() => {
                          const detailsSection = document.getElementById(`details-${assessment.id}`)
                          if (detailsSection) {
                            detailsSection.style.display = detailsSection.style.display === 'none' ? 'table-row' : 'none'
                          }
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {results.assessments.map((assessment) => (
          <div key={`details-${assessment.id}`} id={`details-${assessment.id}`} className="assessment-details" style={{ display: 'none' }}>
            <h3>{assessment.participant_name} - {formatDate(assessment.created_at)}</h3>
            <div className="responses-grid">
              {assessment.responses.map((response) => (
                <div key={response.id} className="response-card">
                  <div className="response-header">
                    <span className="category-label">{getCategoryLabel(response.question_category)}</span>
                    <span className={`score-badge ${getScoreColor(response.score)}`}>
                      {response.score}/5
                    </span>
                  </div>
                  <p className="question-text">{response.question_text}</p>
                  {response.notes && (
                    <div className="response-notes">
                      <strong>Notes:</strong> {response.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsDetails