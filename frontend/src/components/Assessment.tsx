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
  const [currentCategory, setCurrentCategory] = useState('')
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
      setCurrentCategory(categories[0].key)
      
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

  const getCurrentCategoryQuestions = () => {
    return questions.filter(q => q.category === currentCategory)
  }

  if (loading) {
    return <div className="loading">Loading assessment...</div>
  }

  if (!team) {
    return <div className="error">Team not found</div>
  }

  return (
    <div className="assessment">
      <div className="assessment-header">
        <h1>Team Health Assessment</h1>
        <h2>{team.name}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="participant-info">
          <div className="form-group">
            <label htmlFor="participantName">Your Name</label>
            <input
              type="text"
              id="participantName"
              required
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.key}
              type="button"
              className={`tab ${currentCategory === cat.key ? 'active' : ''}`}
              onClick={() => setCurrentCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="questions-section">
          <h3>{categories.find(c => c.key === currentCategory)?.label}</h3>
          
          {getCurrentCategoryQuestions().map((question) => (
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