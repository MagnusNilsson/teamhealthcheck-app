import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface Question {
  id: number
  category: string
  text: string
  order_index: number
}

interface Team {
  id: number
  name: string
  description: string
}

interface Response {
  question_id: number
  score: number
  notes: string
}

const Assessment = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const [team, setTeam] = useState<Team | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [participantName, setParticipantName] = useState('')
  const [responses, setResponses] = useState<{ [key: number]: Response }>({})
  const [loading, setLoading] = useState(true)

  const categories = [
    { key: 'psychological_safety', label: 'Psychological Safety' },
    { key: 'dependability', label: 'Dependability' },
    { key: 'structure_clarity', label: 'Structure & Clarity' },
    { key: 'meaning_impact', label: 'Meaning & Impact' }
  ]

  useEffect(() => {
    fetchTeamAndQuestions()
  }, [teamId])

  const fetchTeamAndQuestions = async () => {
    try {
      const [teamResponse, questionsResponse] = await Promise.all([
        fetch(`http://localhost:8000/teams/${teamId}`),
        fetch('http://localhost:8000/questions/')
      ])
      
      const teamData = await teamResponse.json()
      const questionsData = await questionsResponse.json()
      
      setTeam(teamData)
      setQuestions(questionsData)
      
      // Initialize responses
      const initialResponses: { [key: number]: Response } = {}
      questionsData.forEach((q: Question) => {
        initialResponses[q.id] = { question_id: q.id, score: 3, notes: '' }
      })
      setResponses(initialResponses)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponseChange = (questionId: number, field: 'score' | 'notes', value: number | string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!participantName.trim()) {
      alert('Please enter your name')
      return
    }

    try {
      // Create assessment
      const assessmentResponse = await fetch('http://localhost:8000/assessments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: parseInt(teamId!),
          participant_name: participantName
        })
      })
      
      const assessment = await assessmentResponse.json()
      
      // Submit responses
      const responsesArray = Object.values(responses)
      await fetch(`http://localhost:8000/assessments/${assessment.id}/responses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responsesArray)
      })
      
      navigate(`/results/${teamId}`)
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('Error submitting assessment. Please try again.')
    }
  }

  const getQuestionsByCategory = (category: string) => {
    return questions.filter(q => q.category === category)
  }

  if (loading) {
    return <div className="loading">Loading assessment...</div>
  }

  if (!team) {
    return <div className="error">Team not found</div>
  }

  const totalQuestions = questions.length
  const completedQuestions = Object.values(responses).filter(response => response.score !== 3).length
  const progressPercentage = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0

  return (
    <div className="assessment">
      <div className="assessment-header">
        <h1>Team Health Assessment</h1>
        <h2>{team.name}</h2>
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-text">Assessment Progress</span>
            <span className="progress-numbers">{completedQuestions} of {totalQuestions} questions completed</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="participant-info">
          <h3>Participant Information</h3>
          <p className="assessment-instructions">
            Please provide your name and complete the assessment below. Your responses will remain confidential and will be aggregated with other team members' responses to provide team-level insights.
          </p>
          <div className="form-group">
            <label htmlFor="participantName">Full Name *</label>
            <input
              type="text"
              id="participantName"
              required
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div className="all-categories">
          {categories.map(category => (
            <div key={category.key} className="category-section">
              <h3 className="category-title">{category.label}</h3>
              
              <div className="questions-section">
                {getQuestionsByCategory(category.key).map((question) => (
                  <div key={question.id} className="question-card">
                    <h4>{question.text}</h4>
                    
                    <div className="score-selector">
                      <label>Score (1 = Strongly Disagree, 5 = Strongly Agree):</label>
                      <div className="score-buttons">
                        {[1, 2, 3, 4, 5].map(score => (
                          <button
                            key={score}
                            type="button"
                            className={`score-btn ${responses[question.id]?.score === score ? 'active' : ''}`}
                            onClick={() => handleResponseChange(question.id, 'score', score)}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`notes-${question.id}`}>Additional Notes (optional):</label>
                      <textarea
                        id={`notes-${question.id}`}
                        value={responses[question.id]?.notes || ''}
                        onChange={(e) => handleResponseChange(question.id, 'notes', e.target.value)}
                        placeholder="Any additional thoughts or context..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="assessment-actions">
          <button type="submit" className="btn-primary">
            Submit Assessment
          </button>
        </div>
      </form>
    </div>
  )
}

export default Assessment