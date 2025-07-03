import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Team {
  id: number
  name: string
  description: string
  created_at: string
}

const TeamList = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:8000/teams/')
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/teams/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      })
      
      if (response.ok) {
        setNewTeam({ name: '', description: '' })
        setShowForm(false)
        fetchTeams()
      }
    } catch (error) {
      console.error('Error creating team:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading teams...</div>
  }

  return (
    <div className="team-list">
      <div className="header">
        <div className="header-content">
          <h1>Team Management Dashboard</h1>
          <p className="header-description">
            Manage your teams and conduct professional health assessments to improve organizational effectiveness.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create New Team'}
        </button>
      </div>

      {showForm && (
        <form className="team-form" onSubmit={handleSubmit}>
          <h3>Create New Team</h3>
          <p className="form-description">
            Add a new team to begin conducting health assessments and tracking performance metrics.
          </p>
          <div className="form-group">
            <label htmlFor="name">Team Name *</label>
            <input
              type="text"
              id="name"
              required
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              placeholder="Enter team name (e.g., Product Development Team)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Team Description</label>
            <textarea
              id="description"
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              placeholder="Describe the team's purpose, role, and key responsibilities..."
              rows={4}
            />
          </div>
          <button type="submit" className="btn-primary">Create Team</button>
        </form>
      )}

      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <h3>{team.name}</h3>
            <p>{team.description}</p>
            <div className="team-actions">
              <Link to={`/assessment/${team.id}`} className="btn-primary">
                Conduct Assessment
              </Link>
              <Link to={`/results/${team.id}`} className="btn-outline">
                View Analytics
              </Link>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="empty-state">
          <h3>Welcome to Team Health Assessment</h3>
          <p>Create your first team to begin conducting professional health assessments and tracking organizational effectiveness metrics.</p>
        </div>
      )}
    </div>
  )
}

export default TeamList